import dayjs from "dayjs";
import { NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nc from "next-connect";
import { isModerator } from "../../../../../lib/authorization";
import Config from "../../../../../lib/Config";
import { isJSON } from "../../../../../lib/helper";
import location, { LocationRequest } from "../../../../../lib/middleware/location";
import moderatorRequired from "../../../../../lib/middleware/moderatorRequired";
import prisma from "../../../../../lib/prisma";

const handler = nc<LocationRequest, NextApiResponse>();

handler.use(location);

handler.get(async (req, res) => {
    const session = await getSession({ req });

    if (!req.location) {
        res.status(500).json({ result: 'error', message: 'Location not found' });
        return;
    }

    const dates = {};

    const slots = await prisma.slot.findMany({
        where: {
            date: {
                gte: isModerator(session) ? new Date() : dayjs().add(1, 'd').hour(0).minute(0).second(0).millisecond(0).toDate(),
                lt: isModerator(session) ? undefined : dayjs().add(Config.MAX_DAYS + 1, 'd').hour(0).minute(0).second(0).millisecond(0).toDate(),
            },
            location: req.location,
        },
        include: {
            bookings: true,
            reservations: {
                where: {
                    expiresOn: {
                        gte: new Date(),
                    },
                },
            },
        },
    });

    for (const slot of slots) {
        dates[(new Date(slot.date)).toISOString()] = {
            id: slot.id,
            date: slot.date,
            requireCode: !!slot.code,
            seats: slot.seats,
            occupied: slot.bookings.length + slot.reservations.length,
        };
    }

    res.json(dates)
});

const restrictedHandler = nc<LocationRequest, NextApiResponse>();

restrictedHandler.use(moderatorRequired);

restrictedHandler.post(async (req, res) => {
    if (!isJSON(req)) {
        res.status(400).json({ result: 'error', message: 'Only JSON is accepted' });
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
            if ((await prisma.slot.count({where: {date: slotDate.add(i * gap, 'm').toDate(), location: req.location}})) > 0) {
                throw new Error('Slot already exists');
            }

            await prisma.slot.create({
                data: {
                    date: slotDate.add(i * gap, 'm').toDate(),
                    seats,
                    code,
                    location: {
                        connect: {
                            id: req.location.id
                        }
                    }
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

        res.json({ result: 'partly_failed', errors });

        return;
    }

    res.json({ result: 'success' });
});

handler.use(restrictedHandler);

export default handler;