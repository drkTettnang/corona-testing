import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({result: 'error'});
        return;
    }

    const dates = {};

    const slots = await prisma.slot.findMany({
        where: {
            date: {
                gte: new Date(),
                //TODO restrict max dates
            }
        }
    });

    for (const slot of slots) {
        dates[(new Date(slot.date)).toISOString()] = {
            id: slot.id,
            requireCode: !!slot.code,
            seats: slot.seats,
            occupied: 0,
        };
    }

    const occupiedDates = await prisma.$queryRaw(`SELECT date, COUNT(*) AS count FROM (
        SELECT date FROM reservations WHERE expires_on >= '${(new Date()).toISOString()}'
        UNION ALL
        SELECT date from bookings WHERE date > '${(new Date()).toISOString()}'
    ) AS C GROUP BY date`);

    for(let od of occupiedDates) {
        const key = (new Date(od.date)).toISOString();

        if (typeof dates[key] !== 'undefined') {
            dates[key].occupied = od.count;
        }
    }

    res.status(200).json(dates)
}