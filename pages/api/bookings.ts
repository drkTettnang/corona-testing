import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client';
import prisma from '../../lib/prisma';

async function handleGet(req: NextApiRequest, res: NextApiResponse, session: Session) {
    const bookings = await prisma.booking.findMany({
        where: {
            email: session.user.email,
        },
    });

    res.status(200).json(bookings)
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

    return handleGet(req, res, session);
}