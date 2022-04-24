import { CWAVariant, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const location = await prisma.location.upsert({
        where: {
            id: 1,
        },
        update: {},
        create: {
            id: 1,
            name: 'Hauptstelle',
            address: 'Musterstr. 1, 12345 Musterhausen',
            description: '',
            rollingBooking: false,
        }
    });

    const slotA = await prisma.slot.create({
        data: {
            date: new Date((new Date()).getTime() - 14 * 24 * 60 * 60 * 1000),
            seats: 10,
            locationId: location.id,
        },
    });

    const slotB = await prisma.slot.create({
        data: {
            date: new Date(),
            seats: 10,
            locationId: location.id,
        },
    });

    const slotC = await prisma.slot.create({
        data: {
            date: new Date((new Date()).getTime() + 5 * 24 * 60 * 60 * 1000),
            seats: 10,
            locationId: location.id,
        },
    });

    for (let i = 0; i < 5; i++) {
        await prisma.booking.create({
            data: {
                birthday: new Date('1990-01-01'),
                firstName: 'Foo',
                lastName: 'Bar' + i,
                city: 'Musterhausen',
                postcode: '12345',
                date: slotA.date,
                email: 'foo@bar',
                street: 'Musterstr. 1',
                createdAt: slotA.date,
                cwa: CWAVariant.none,
                evaluatedAt: slotA.date,
                personalA: 'Foobar',
                phone: '123456',
                result: 'negativ',
                testKitName: 'Foobar special',
                slotId: slotA.id,
            },
        });
    }

    for (let i = 0; i < 5; i++) {
        await prisma.booking.create({
            data: {
                birthday: new Date('1990-01-01'),
                firstName: 'Bar',
                lastName: 'Bar' + i,
                city: 'Musterhausen',
                postcode: '12345',
                date: slotB.date,
                email: 'foo@bar',
                street: 'Musterstr. 1',
                createdAt: slotB.date,
                phone: '123456',
                slotId: slotB.id,
            },
        });
    }

    for (let i = 0; i < 3; i++) {
        await prisma.booking.create({
            data: {
                birthday: new Date('1990-01-01'),
                firstName: 'Foo',
                lastName: 'Foo' + i,
                city: 'Musterhausen',
                postcode: '12345',
                date: slotC.date,
                email: 'foo@bar',
                street: 'Musterstr. 1',
                createdAt: slotC.date,
                phone: '123456',
                slotId: slotC.id,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })