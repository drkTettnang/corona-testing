import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({result: 'error'});
        return;
    }

    const session = await getSession({req});

    if (!session) {
        res.status(401).json({result: 'error'});
        return;
    }

    const reservations = await prisma.reservation.findMany({
        where: {
            email: session.user.email,
            expiresOn: {
                gte: new Date(),
            }
        },
    });

    if (!reservations || reservations.length === 0) {
        res.json({});
        return;
    }

    res.status(200);

    res.json(reservations.reduce((data, current) => {
        if (!data.date || current.date.getTime() !== data.date.getTime()) {
            res.status(409);

            return {};
        }

        return {
            expiresOn: data.expiresOn,
            date: data.date,
            numberOfChildren: data.numberOfChildren + (!current.adult ? 1 : 0),
            numberOfAdults: data.numberOfAdults + (current.adult ? 1 : 0),
        }
    }, {
        expiresOn: reservations[0].expiresOn,
        date: reservations[0].date,
        numberOfChildren: 0,
        numberOfAdults: 0,
    }));
}