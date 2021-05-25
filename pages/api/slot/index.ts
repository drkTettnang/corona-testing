import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import Config from "../../../lib/Config";
import { RESERVATION_DURATION } from "../../../lib/const";
import prisma from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const slots = await prisma.slot.findMany({
        select: {
            date: true,
            seats: true,
            locationId: true,
            code: true,
            _count: {
                select: {
                    bookings: true,
                }
            }
        },
        where: {
            OR: [{
                date: {
                    gte: dayjs().add(RESERVATION_DURATION, 'minutes').toDate(),
                    lt: dayjs().add(Config.MAX_DAYS + 1, 'd').hour(0).minute(0).second(0).millisecond(0).toDate(),
                },
                location: {
                    rollingBooking: true,
                }
            }, {
                date: {
                    gte: dayjs().add(1, 'd').hour(0).minute(0).second(0).millisecond(0).toDate(),
                    lt: dayjs().add(Config.MAX_DAYS + 1, 'd').hour(0).minute(0).second(0).millisecond(0).toDate(),
                },
                location: {
                    rollingBooking: false,
                }
            }]
        },
        orderBy: [{
            locationId: 'asc',
        }, {
            date: 'asc',
        }]
    });

    const slotsGroupedByLocation = slots.reduce((group, slot) => {
        if (!group[slot.locationId]) {
            group[slot.locationId] = [];
        }

        group[slot.locationId].push({
            date: slot.date,
            protected: !!slot.code,
            seats: slot.seats,
            bookings: slot._count.bookings,
        });

        return group;
    }, {} as { [locationId: number]: { date: Date, protected: boolean, seats: number, bookings: number }[] });

    const locations = await prisma.location.findMany({
        select: {
            id: true,
            name: true,
            address: true,
            description: true,
        },
        where: {
            OR: Object.keys(slotsGroupedByLocation).map(id => ({ id: parseInt(id, 10) })),
        },
        orderBy: {
            name: 'asc',
        },
    });

    const data = locations.map(location => ({...location, slots: slotsGroupedByLocation[location.id]}));

    res.json(data);
});

export default handler;