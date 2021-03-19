import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../../lib/authorization';
import { getMac } from '../../../../lib/hmac';
import prisma from '../../../../lib/prisma';

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

    if (!isModerator(session)) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const matches = req.query.bookingId?.toString().match(/^(\d+)(?:\.(pdf|print))?$/i);

    if (!matches) {
        res.status(400).json({ result: 'error', message: 'Invalid path' });
        return;
    }

    const bookingId = parseInt(matches[1], 10);
    const format = matches[2] || 'html';

    if (isNaN(bookingId) || bookingId <= 0) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
    });

    if (!booking) {
        res.status(404).json({ result: 'error', message: 'Booking not found' });
        return;
    }

    if (!['positiv', 'negativ'].includes(booking.result)) {
        res.status(404).json({ result: 'error', message: 'No valid result' });
        return;
    }

    const mac = getMac(bookingId.toString());

    res.redirect(`/certificate/${mac}-${bookingId}${format !== 'html' ? ('.' + format) : ''}`);
}