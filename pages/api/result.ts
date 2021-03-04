import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../lib/authorization';
import { sendResultEmail } from '../../lib/email';
import prisma from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({result: 'error'});
        return;
    }

    const session = await getSession({req});

    if (!isModerator(session)) {
        res.status(401).json({result: 'error'});
        return;
    }

    const id = parseInt(req.body?.id as string, 10);
    const result = req.body?.result as string;

    if (isNaN(id) || id < 0) {
        res.status(400).json({result: 'id', message: `${id} is no valid id`});
        return;
    }

    if (!['invalid', 'unknown', 'positiv', 'negativ'].includes(result)) {
        res.status(400).json({result: 'result', message: `${result} is no valid result`});
        return;
    }

    const booking = await prisma.booking.update({
        where: {
            id,
        },
        data: {
            result
        }
    });

    await sendResultEmail(booking);

    res.status(200).json(booking);
}