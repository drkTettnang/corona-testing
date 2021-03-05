import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../../lib/authorization';
import prisma from '../../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
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

    const id = parseInt(req.query.id.toString(), 10);
    const seats = req.body?.seats ? parseInt(req.body?.seats, 10) : undefined;

    if (isNaN(id) || id.toString() !== req.query.id.toString()) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    if (!seats || seats < 1 || seats > 100) {
        res.status(400).json({ result: 'error', message: 'Seats out of range' });
        return;
    }

    const slot = await prisma.slot.update({
        where: {
            id,
        },
        data: {
            seats
        }
    });

    res.status(200).json(slot);
}