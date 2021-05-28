import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator, useAuthHeader } from '../../lib/authorization';
import prisma, { isDay } from '../../lib/prisma';



export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const locationId = useAuthHeader(req);

    const session = await getSession({ req });

    if (!isModerator(session) && typeof locationId !== 'number') {
        res.status(401).json({ result: 'error' });
        return;
    }

    const id = parseInt(req.query?.id as string, 10);
    const firstName = req.query?.firstName as string;
    const lastName = req.query?.lastName as string;
    const lastId = parseInt(req.query?.lastId as string, 10);

    const isValidId = !isNaN(id) && id >= 0;
    const isValidLastId = !isNaN(lastId) && lastId >= 0;
    const isValidName = firstName && lastName && typeof firstName === 'string' && typeof lastName === 'string';

    if (!isValidLastId && !(isValidId || isValidName)) {
        res.status(400).json({ result: 'params' });
        return;
    }

    if (isValidLastId && (isValidId || isValidName)) {
        res.status(400).json({ result: 'too_many_params' });
        return;
    }

    if (isValidLastId) {
        if (typeof locationId !== 'number') {
            res.status(400).json({ result: 'error', message: 'lastId only supported with auth header' });
            return;
        }

        const numberOfBookings = await prisma.booking.count({
            where: {
                id: {
                    lte: lastId,
                },
                date: isDay(),
                slot: {
                    locationId,
                }
            }
        });

        if (numberOfBookings <= 0) {
            res.status(400).json({ result: 'error', message: 'lastId is not valid' });
            return;
        }
    }

    const where = isValidLastId ? {
        id: {
            gt: lastId,
        }
    } : {
        id: !isValidId ? undefined : id,
        firstName,
        lastName,
    };

    if (locationId !== false) {
        where['date'] = isDay();
        where['slot'] = {
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

    res.status(200).json(bookings)
}