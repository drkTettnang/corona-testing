import type { NextApiRequest, NextApiResponse } from 'next'
import { DATES_PER_SLOT, END_TIME, SLOT_DURATION, START_TIME } from '../../lib/const';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({result: 'error'});
        return;
    }

    const startTime = START_TIME;
    const slotDuration = SLOT_DURATION;
    const datesPerSlot = DATES_PER_SLOT;
    const endTime = END_TIME;
    const halfTime = new Date(startTime.getTime() + ((endTime.getTime() - startTime.getTime()) / 2));

    const dates = {};

    for (let i = 0; ; i++) {
        let slotDate = new Date(startTime);
        slotDate.setMinutes(startTime.getMinutes() + (slotDuration * i));

        const delta = slotDate.getTime() - halfTime.getTime();

        if (delta > 0 && delta <= slotDuration * 60 * 1000) {
            continue;
        }

        if (slotDate.getTime() >= endTime.getTime()) {
            break;
        }

        dates[slotDate.toISOString()] = datesPerSlot;
    }

    const occupiedDates = await prisma.$queryRaw(`SELECT date, COUNT(*) AS count FROM (
        SELECT date FROM reservations WHERE expires_on >= '${(new Date()).toISOString()}'
        UNION ALL
        SELECT date from bookings
    ) AS C GROUP BY date`);

    for(let od of occupiedDates) {
        dates[(new Date(od.date)).toISOString()] -= od.count;
    }

    res.status(200).json(dates)
}