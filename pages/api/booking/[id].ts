import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../lib/authorization';
import { sendCancelationEmail } from '../../../lib/email/cancel';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'DELETE') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const id = parseInt(req.query.id.toString(), 10);

    if (isNaN(id)) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    let booking = await prisma.booking.findUnique({
        where: {
            id,
        }
    });

    if (!booking) {
        res.status(400).json({ result: 'error', message: 'Booking does not exist' });
        return;
    }

    if (new Date(booking.date) < new Date() || booking.result !== 'unknown') {
        res.status(400).json({ result: 'error', message: 'Can not delete old or processed bookings' });
        return;
    }

    if (isModerator(session) || (booking.email && session.user?.email === booking.email)) {
        booking = await prisma.booking.delete({
            where: {
                id,
            }
        });
    } else {
        res.status(401).json({ result: 'error', message: 'No permission' });
        return;
    }

    try {
        await sendCancelationEmail(booking);
    } catch (err) {
        console.log('Could not send cancelation mail', err);

        res.status(500).json({ result: 'mail', message: 'Mail failed' });
        return;
    }

    console.log(`${session.user?.email} canceled booking ${booking.id}`);

    res.status(200).json(booking);
}