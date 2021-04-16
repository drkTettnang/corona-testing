import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import prisma, { insertIntoArchiv } from "../../lib/prisma";
import { Role } from "@prisma/client";

const RETENTION = parseInt(process.env.RETENTION_DAYS || '14', 10);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({ result: 'error' });
        return;
    }

    if (process.env.WEB_CRON_AUTH && req.query?.auth !== process.env.WEB_CRON_AUTH) {
        res.status(401).json({ result: 'error' });

        console.log('Web cron request without or wrong auth query');
        return;
    }

    if (isNaN(RETENTION) || RETENTION < 1) {
        console.log('Retention value is invalid');
        return;
    }

    console.log('Cron started');

    const bookingsToBeDeleted = await prisma.booking.findMany({
        where: {
            date: {
                lt: dayjs().subtract(RETENTION, 'days').toDate(),
            },
        },
    });

    for (const booking of bookingsToBeDeleted) {
        await insertIntoArchiv(booking);

        // We can't use deleteMany since new records could have been expired
        await prisma.booking.delete({
            where: {
                id: booking.id,
            }
        });
    }

    const reservations = await prisma.reservation.deleteMany({
        where: {
            expiresOn: {
                lt: new Date(),
            },
        },
    });

    const verificationRequests = await prisma.verificationRequest.deleteMany({
        where: {
            expires: {
                lt: new Date(),
            },
        },
    });

    const sessions = await prisma.session.deleteMany({
        where: {
            expires: {
                lt: new Date(),
            },
        },
    });

    const userIdsWithActiveSession = (await prisma.session.findMany({
        select: {
            userId: true,
        }
    })).map(row => row.userId);

    const users = await prisma.user.deleteMany({
        where: {
            updatedAt: {
                lt: dayjs().subtract(RETENTION, 'days').toDate(),
            },
            id: {
                notIn: userIdsWithActiveSession,
            },
            role: Role.user
        },
    });

    console.log('Cron finished', {
        bookings: bookingsToBeDeleted.length,
        reservations: reservations.count,
        verificationRequests: verificationRequests.count,
        sessions: sessions.count,
        users: users.count,
    });

    res.status(200).json({ result: 'success' });
}