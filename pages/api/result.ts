import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator, useAuthHeader } from '../../lib/authorization';
import { sendResultEmail } from '../../lib/email';
import prisma, { isDay } from '../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({result: 'error'});
        return;
    }

    const locationId = useAuthHeader(req);

    const session = await getSession({req});

    if (!isModerator(session) && typeof locationId !== 'number') {
        res.status(401).json({result: 'error'});
        return;
    }

    const id = parseInt(req.body?.id as string, 10);
    const result = req.body?.result as string;
    const tester = req.body?.tester as string;

    if (isNaN(id) || id < 0) {
        res.status(400).json({result: 'id', message: `${id} is no valid id`});
        return;
    }

    if (!['invalid', 'unknown', 'positiv', 'negativ'].includes(result)) {
        res.status(400).json({result: 'result', message: `${result} is no valid result`});
        return;
    }

    if (locationId !== false) {
        const bookingExists = (await prisma.booking.count({
            where: {
                id,
                date: isDay(),
                slot: {
                    locationId,
                }
            }
        })) === 1;

        if (!bookingExists) {
            res.status(400).json({result: 'id', message: `There is no booking with this id today`});
            return;
        }
    }

    const booking = await prisma.booking.update({
        where: {
            id,
        },
        data: {
            result,
            personalA: tester,
            evaluatedAt: new Date(),
        }
    });

    try {
        await sendResultEmail(booking);
    } catch(err) {
        console.log(`Could not send result via mail for booking ${id}`, err);

        res.status(500).json({ result: 'mail', message: 'Could not send mail' });
        return;
    }

    console.log(`Result processed for booking ${id}`, {user: typeof locationId === 'number' ? `station:${locationId}` : session.user?.email});

    res.status(200).json(booking);
}