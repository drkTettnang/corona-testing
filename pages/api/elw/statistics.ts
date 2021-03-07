import dayjs from 'dayjs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client';
import { isModerator } from '../../../lib/authorization';
import prisma from '../../../lib/prisma';

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

    res.json(aggregated);
}