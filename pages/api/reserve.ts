import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';
import Config from '../../lib/Config';
import { RESERVATION_DURATION } from '../../lib/const';
import { getNumberOfRemainingDates, sleep } from '../../lib/helper';
import { isModerator } from '../../lib/authorization';
import dayjs from 'dayjs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT' && req.method !== 'DELETE') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    if (req.method === 'PUT') {
        const slotId = parseInt(req.body?.slotId, 10);
        const numberOfAdults = parseInt(req.body?.numberOfAdults, 10);
        const numberOfChildren = parseInt(req.body?.numberOfChildren, 10);
        const code = typeof req.body?.code === 'string' ? req.body?.code as string : '';

        if (isNaN(slotId) ||
            slotId < 0 ||
            isNaN(numberOfAdults) ||
            isNaN(numberOfChildren) ||
            numberOfAdults < 0 ||
            numberOfAdults > Config.MAX_ADULTS ||
            numberOfChildren < 0 ||
            numberOfChildren > Config.MAX_CHILDREN ||
            (numberOfAdults + numberOfChildren) <= 0 ||
            (numberOfAdults + numberOfChildren) > Config.MAX_GROUP) {
            res.status(400).json({ result: 'error', message: 'Invalid slot id or number of children / adults' });
            return;
        }

        const slot = await prisma.slot.findUnique({
            where: {
                id: slotId,
            },
            include: {
                location: true,
            },
        });

        if (!slot) {
            res.status(400).json({ result: 'error', message: 'Slot does not exist' });
            return;
        }

        const latestReservationDate = (isModerator(session) || slot.location.rollingBooking)
            ?
            new Date(slot.date)
            :
            dayjs(slot.date).hour(0).minute(0).second(0).millisecond(0).toDate();

        if (new Date() > latestReservationDate) {
            res.status(400).json({ result: 'error', message: 'Too late for that slot' });
            return;
        }

        if (Math.abs(dayjs().diff(slot.date, 'days')) > Config.MAX_DAYS && !isModerator(session)) {
            res.status(400).json({ result: 'error', message: 'Too early for that slot' });
            return;
        }

        if (slot.code) {
            // brute force throttle
            await sleep(3);

            if (slot.code.toLowerCase() !== code.toLowerCase()) {
                res.status(400).json({ result: 'error', message: 'Wrong code' });
                return;
            }
        }

        const numberOfReservations = await prisma.reservation.count({
            where: {
                slot,
                expiresOn: {
                    gte: new Date(),
                }
            }
        });
        const numberOfBookings = await prisma.booking.count({
            where: {
                slot,
            }
        });

        if ((numberOfBookings + numberOfReservations + numberOfAdults + numberOfChildren) > slot.seats) {
            res.status(409).json({ result: 'conflict' });
            return;
        }

        const bookings = await prisma.booking.findMany({
            where: {
                email: session.user.email,
            },
        });

        if (getNumberOfRemainingDates(bookings, slot.date) === 0) {
            res.status(409).json({ result: 'booked' });
            return;
        }

        let expiresOn = dayjs().add(RESERVATION_DURATION, 'minutes').toDate();

        if (expiresOn > new Date(slot.date)) {
            expiresOn = new Date(slot.date);
        }

        await Promise.all(Array.from({
            length: numberOfChildren + numberOfAdults,
        }, (_, i) => prisma.reservation.create({
            data: {
                slot: {
                    connect: {
                        id: slot.id
                    }
                },
                email: session.user.email,
                adult: i < numberOfAdults,
                expiresOn,
            }
        })));

        res.status(200).json({ result: 'success' });
    } else if(req.method === 'DELETE') {
        await prisma.reservation.deleteMany({
            where: {
                email: session.user.email,
            }
        });

        res.status(200).json({ result: 'success' });
    }
}