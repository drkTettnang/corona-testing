import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import { getSession } from 'next-auth/client';
import { isModerator, useAuthHeader } from '../../lib/authorization';
import { sendResultEmail } from '../../lib/email/result';
import prisma, { isDay } from '../../lib/prisma';
import { isJSON } from '../../lib/helper';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    if (!isJSON(req)) {
        res.status(400).json({ result: 'error', message: 'Only JSON is accepted' });
        return;
    }

    const locationId = useAuthHeader(req);

    const session = await getSession({ req });

    if (!isModerator(session) && typeof locationId !== 'number') {
        res.status(401).json({ result: 'error' });
        return;
    }

    const id = parseInt(req.body?.id as string, 10);
    const result = req.body?.result as string;
    const tester = req.body?.tester as string;
    const evaluatedAt = (isModerator(session) && req.body?.evaluatedAt) ? new Date(req.body?.evaluatedAt) : new Date();

    if (isNaN(id) || id < 0) {
        res.status(400).json({ result: 'id', message: `${id} is no valid id` });
        return;
    }

    if (!['invalid', 'unknown', 'positiv', 'negativ'].includes(result)) {
        res.status(400).json({ result: 'result', message: `${result} is no valid result` });
        return;
    }

    if (isNaN(evaluatedAt.getTime())) {
        res.status(400).json({ result: 'evaluatedAt', message: `Evaluated at date is invalid` });
        return;
    }

    const where = {
        id,
        date: undefined,
        slot: undefined,
    };

    if (locationId !== false) {
        where.date = isDay();
        where.slot = {
            locationId,
        };
    }

    const bookings = await prisma.booking.findMany({
        where,
        include: {
            slot: {
                include: {
                    location: true,
                },
            },
        },
    });

    if (bookings.length !== 1) {
        res.status(400).json({ result: 'id', message: `There is no booking with this id` });
        return;
    }

    const updatedBooking = await prisma.booking.update({
        where: {
            id,
        },
        data: {
            result,
            personalA: tester,
            evaluatedAt,
            testKitName: bookings[0].slot.location.testKitName,
        }
    });

    try {
        await sendResultEmail(updatedBooking);
    } catch (err) {
        console.log(`Could not send result via mail for booking ${id}`, err);

        res.status(500).json({ result: 'mail', message: 'Could not send mail' });
        return;
    }

    console.log(`Result processed for booking ${id}`, { user: typeof locationId === 'number' ? `station:${locationId}` : session.user?.email });

    res.status(200).json(updatedBooking);
})

export default handler;