import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { sendConfirmationEmail } from '../../lib/email';
import Config from '../../lib/Config';

interface Application {
    firstName: string,
    lastName: string,
    street: string,
    postcode: string,
    city: string,
    birthday: Date,
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const date = new Date(req.body?.date);
    const applications: Application[] = req.body?.applications || [];

    if (isNaN(date.getTime()) || applications.length === 0) {
        res.status(400).json({ result: 'error' });
        return;
    }

    let numberOfAdults = 0;
    let numberOfChildren = 0;

    try {
        for (let application of applications) {
            const age = verifyApplication(application);

            if (age < 18) {
                numberOfChildren++;
            } else {
                numberOfAdults++;
            }
        }
    } catch (err) {
        res.status(400).json({ result: 'error', field: err });
        return;
    }

    if (numberOfAdults < 1 || numberOfAdults > Config.MAX_ADULTS || numberOfChildren > Config.MAX_CHILDREN) {
        res.status(400).json({ result: 'error', message: 'Unexpected number of people' });
        return;
    }

    const reservationCount = await prisma.reservation.count({
        where: {
            date,
            email: session.user.email,
            expiresOn: {
                gte: new Date(),
            }
        },
    });

    if (reservationCount !== (numberOfAdults + numberOfChildren)) {
        res.status(400).json({ result: 'reservation' });
        return;
    }

    const slot = await prisma.slot.findUnique({
        where: {
            date
        }
    });

    if (!slot || (await getOccupation(date)) > slot.seats) {
        res.status(409).json({ result: 'conflict' });
        return;
    }

    let bookings = await Promise.all(applications.map(application => {
        return prisma.booking.create({
            data: {
                email: session.user.email,
                date,
                firstName: application.firstName,
                lastName: application.lastName,
                birthday: application.birthday,
                street: application.street,
                postcode: application.postcode,
                city: application.city,
            }
        });
    }))

    await prisma.reservation.deleteMany({
        where: {
            email: session.user.email,
        }
    });

    try {
        await sendConfirmationEmail(date, session.user.email, bookings);
    } catch (err) {
        console.log(err);

        res.status(200).json({ result: 'email_failed' });
        return;
    }

    res.status(200).json({ result: 'success' });
}

function verifyApplication({ firstName, lastName, birthday, street, postcode, city }) {
    if (typeof firstName !== 'string' || !firstName || firstName.length > 120) {
        throw 'Vorname';
    }

    if (typeof lastName !== 'string' || !lastName || lastName.length > 120) {
        throw 'Nachname';
    }

    if (isNaN((new Date(birthday)).getTime())) {
        throw 'Geburtstag';
    }

    const age = dayjs().diff(birthday, 'year');

    if (age <= 0 || age > 110) {
        throw 'Geburtstag';
    }

    if (typeof street !== 'string' || !street || street.length > 120) {
        throw 'Straße';
    }

    if (typeof postcode !== 'string' || !/^\d{5}$/.test(postcode)) {
        throw 'PLZ';
    }

    if (typeof city !== 'string' || !city || city.length > 120) {
        throw 'Ort';
    }

    return age;
}

async function getOccupation(date: Date) {
    const numberOfReservations = await prisma.reservation.count({
        where: {
            date,
            expiresOn: {
                gte: new Date(),
            }
        }
    });
    const numberOfBookings = await prisma.booking.count({
        where: {
            date,
        }
    });

    return numberOfReservations + numberOfBookings;
}