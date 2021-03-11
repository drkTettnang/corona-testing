import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../lib/authorization';
import prisma from '../../../lib/prisma';

async function getResultStatistic() {
    const rows = await prisma.$queryRaw<{count: number, date: string, result: string}[]>('SELECT count(*) as count, DATE(date) as date, result FROM bookings WHERE date < (CURDATE() + INTERVAL 1 DAY) GROUP BY DATE(date), result ORDER BY DATE(date) DESC');
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

    return {
        bookings: bookingRows,
        occupiedSlots: occupiedRows,
        availableSlots: slotRows,
        today: todayRows,
    };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    if (!isModerator(session)) {
        res.status(401).json({ result: 'error' });
        return;
    }

    res.json({
        results: await getResultStatistic(),
        bookings: await getBookingStatistic(),
    });
}