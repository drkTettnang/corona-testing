import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import prisma from '../../../lib/prisma';
import moderatorRequired from '../../../lib/middleware/moderatorRequired';

async function getResultStatistic() {
    const rows = await prisma.$queryRaw<{count: number, date: string, result: string}[]>(`
        SELECT count(*) as count, DATE(date) as date, result
        FROM (
            SELECT date, result FROM bookings
            UNION ALL
            SELECT date, result FROM archiv WHERE result != 'canceled'
        ) AS b
        WHERE date < (CURDATE() + INTERVAL 1 DAY) AND date > (CURDATE() - INTERVAL 14 DAY)
        GROUP BY DATE(date), result
        ORDER BY DATE(date) DESC`
    );
    const aggregated = {};

    for(const row of rows) {
        const {count, date, result} = row;

        if (!aggregated[date]) {
            aggregated[date] = {
                unknown: 0,
                invalid: 0,
                positiv: 0,
                negativ: 0,
            };
        }

        aggregated[date][result] = count;
    }

    return aggregated;
}

async function getBookingStatistic() {
    const bookingRows = await prisma.$queryRaw<{count: number, createdAt: string}[]>('SELECT count(*) as count, DATE(created_at) as createdAt FROM bookings WHERE created_at > (CURDATE() - INTERVAL 14 DAY) GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC');

    const occupiedRows = await prisma.$queryRaw<{count: number, createdAt: string}[]>('SELECT count(*) as count, DATE(date) as date FROM bookings WHERE date > (CURDATE() - INTERVAL 14 DAY) GROUP BY DATE(date) ORDER BY DATE(date) DESC');

    const slotRows = await prisma.$queryRaw<{count: number, createdAt: string}[]>('SELECT SUM(seats) as count, DATE(date) as date FROM slots WHERE date > (CURDATE() - INTERVAL 14 DAY) GROUP BY DATE(date) ORDER BY DATE(date) DESC');

    const todayRows = await prisma.$queryRaw<{count: number, createdAt: string}[]>('SELECT date, created_at as createdAt FROM bookings WHERE DATE(created_at) = CURDATE() ORDER BY created_at DESC');

    const weeklyRows = await prisma.$queryRaw(
        `SELECT WEEK(date, 7) as week,
            YEAR(date) as year,
            YEARWEEK(date, 7) as yearweek,
            AVG(age) as age,
            STD(age) as stdAge,
            COUNT(IF(result != 'canceled', 1, NULL)) AS count,
            COUNT(IF(result = 'negativ', 1, NULL)) AS negativ,
            COUNT(IF(result = 'invalid', 1, NULL)) AS invalid,
            COUNT(IF(result = 'positiv', 1, NULL)) AS positiv,
            COUNT(IF(result = 'unknown', 1, NULL)) AS unknown,
            COUNT(IF(result = 'canceled', 1, NULL)) AS canceled
        FROM (
            SELECT date, result, TIMESTAMPDIFF(YEAR, birthday, CURDATE()) as age
            FROM bookings
            UNION ALL
            SELECT date, result, age
            FROM archiv
        ) AS b
        GROUP BY YEARWEEK(date, 7)
        ORDER BY yearweek`
    );

    return {
        bookings: bookingRows,
        occupiedSlots: occupiedRows,
        availableSlots: slotRows,
        today: todayRows,
        weekly: weeklyRows,
    };
}

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(moderatorRequired);

handler.get(async (req, res) => {
    res.json({
        results: await getResultStatistic(),
        bookings: await getBookingStatistic(),
    });
});

export default handler;