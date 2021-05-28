import { getSession } from 'next-auth/client';
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import Config from '../../lib/Config';
import { sendConfirmationEmail } from '../../lib/email/confirmation';
import CWA from '../../lib/CWA';
import { CWAVariant } from '@prisma/client';

interface Application {
    firstName: string,
    lastName: string,
    street: string,
    postcode: string,
    city: string,
    birthday: Date,
    phone: string,
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

    const slotId = parseInt(req.body?.slotId, 10);
    const applications: Application[] = req.body?.applications || [];

    if (isNaN(slotId) || slotId < 0 || applications.length === 0) {
        res.status(400).json({ result: 'error' });
        return;
    }

    if (!req.body?.consent) {
        res.status(400).json({ result: 'error', message: 'Consent is required' });
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
        res.status(404).json({ result: 'error', message: 'Slot does not exist' });
        return;
    }

    let numberOfAdults = 0;
    let numberOfChildren = 0;

    try {
        for (let application of applications) {
            const age = verifyApplication(slot.date, application);

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

    if ((numberOfAdults + numberOfChildren) < 1 || numberOfAdults > Config.MAX_ADULTS || numberOfChildren > Config.MAX_CHILDREN) {
        res.status(400).json({ result: 'error', message: 'Unexpected number of people' });
        return;
    }

    const reservationCount = await prisma.reservation.count({
        where: {
            slotId,
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

    if ((await getOccupation(slot.id)) > slot.seats) {
        res.status(409).json({ result: 'conflict' });
        return;
    }

    const cwaSelection = Object.values(CWAVariant).includes(req.body.cwa) ? req.body.cwa : CWAVariant.none;

    let bookings = await Promise.all(applications.map(application => {
        return prisma.booking.create({
            data: {
                email: session.user.email,
                date: slot.date,
                firstName: application.firstName,
                lastName: application.lastName,
                birthday: application.birthday,
                street: application.street,
                postcode: application.postcode,
                city: application.city,
                phone: application.phone,
                slot: {
                    connect: {
                        id: slot.id,
                    },
                },
                salt: CWA.generateSalt(),
                cwa: cwaSelection,
            }
        });
    }));

    console.log(`${session.user.email} booked ${applications.length} dates`);

    await prisma.reservation.deleteMany({
        where: {
            email: session.user.email,
        }
    });

    try {
        await sendConfirmationEmail(slot, session.user.email, bookings);
    } catch (err) {
        console.log('Could not send confirmation mail', err);

        res.status(200).json({ result: 'email_failed' });
        return;
    }

    res.status(200).json({ result: 'success' });
}

function verifyApplication(testDate: Date, { firstName, lastName, birthday, street, postcode, city, phone }) {
    if (typeof firstName !== 'string' || !firstName || firstName.length > 80) {
        throw 'Vorname';
    }

    if (typeof lastName !== 'string' || !lastName || lastName.length > 80) {
        throw 'Nachname';
    }

    if (!birthday || isNaN((new Date(birthday)).getTime())) {
        throw 'Geburtstag';
    }

    const age = dayjs(testDate).diff(birthday, 'year');

    if (age < Config.MIN_AGE || age > 110) {
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

    if (typeof phone !== 'string' || !phone || phone.length > 30) {
        throw 'Telefon';
    }

    return age;
}

async function getOccupation(slotId: number) {
    const numberOfReservations = await prisma.reservation.count({
        where: {
            slotId,
            expiresOn: {
                gte: new Date(),
            }
        }
    });
    const numberOfBookings = await prisma.booking.count({
        where: {
            slotId,
        }
    });

    return numberOfReservations + numberOfBookings;
}