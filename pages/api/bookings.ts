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

    const bookings = await prisma.booking.findMany({
        where: {
            email: session.user.email,
        },
    });

    res.status(200).json(bookings)
}