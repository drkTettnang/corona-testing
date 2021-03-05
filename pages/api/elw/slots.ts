import dayjs from 'dayjs';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client';
import { isModerator } from '../../../lib/authorization';
import prisma from '../../../lib/prisma';

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: Session) {
    if (!isModerator(session)) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const date = new Date(req.body?.date);
    const seats = parseInt(req.body?.seats, 10) || 1;
    const count = parseInt(req.body?.count, 10) || 1;
    const gap = parseInt(req.body?.gap, 10) || 15;
    const code = req.body?.code || '';

    if (isNaN(date.getTime()) || date < (new Date())) {
        res.status(400).json({ result: 'date' });
        return;
    }

    if (seats < 1 || seats > 100 || count < 1 || count > 160 || gap < 5 || gap > 60) {
        res.status(400).json({ result: 'error' });
        return;
    }

    const slotDate = dayjs(date);
    const errors = [];

    for (let i = 0; i < count; i++) {
        try {
            await prisma.slot.create({
                data: {
                    date: slotDate.add(i * gap, 'm').toDate(),
                    seats,
                    code,
                }
            });
        } catch (err) {
            console.warn('Could not create slot', err);

            errors.push(slotDate.add(i * gap, 'm').toDate());
        }
    }

    if (errors.length > 0) {
        if (errors.length === count) {
            res.status(400).json({ result: 'failed' });

            return;
        }

        res.status(200).json({ result: 'partly_failed', errors });

        return;
    }

    res.status(200).json({ result: 'success' });
}

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

    if (req.method === 'POST') {
        return handlePost(req, res, session);
    }
}