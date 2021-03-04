import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../lib/authorization';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({result: 'error'});
        return;
    }

    const session = await getSession({req});

    if (!isModerator(session)) {
        res.status(401).json({result: 'error'});
        return;
    }

    const id = parseInt(req.query?.id as string, 10);
    const firstName = req.query?.firstName as string;
    const lastName = req.query?.lastName as string;

    if ((isNaN(id) || id < 0) && (!firstName || !lastName || typeof firstName !== 'string' || typeof lastName !== 'string')) {
        res.status(400).json({result: 'params'});
        return;
    }

    const bookings = await prisma.booking.findMany({
        where: {
            id: isNaN(id) ? undefined : id,
            firstName,
            lastName,
        },
    });

    res.status(200).json(bookings)
}