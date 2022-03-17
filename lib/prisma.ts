import { CWAVariant, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import crypto from 'crypto';

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient()
    }

    prisma = (global as any).prisma
}

export default prisma;

export function isDay(date = new Date()) {
    const startDate = dayjs(date).hour(0).minute(0).second(0);
    const endDate = startDate.add(1, 'day');

    return {
        gte: startDate.toDate(),
        lt: endDate.toDate(),
    }
}

export async function insertIntoArchiv(data: { firstName: string, lastName: string, birthday: Date, date: Date, slot: { locationId: number }, evaluatedAt?: Date, result: string, testKitName?: string, cwa: CWAVariant }) {
    if (!process.env.SECRET) {
        throw new Error('Salt not available');
    }

    const person = crypto.createHash('sha256')
        .update(data.firstName.toLowerCase().trim())
        .update(data.lastName.toLowerCase().trim())
        .update(data.birthday.getTime().toString())
        .update(process.env.SECRET)
        .digest('hex');

    const exists = await prisma.archiv.count({
        where: {
            person,
            date: data.date,
        }
    }) !== 0;

    if (exists) {
        throw new Error('Duplicate detected');
    }

    return prisma.archiv.create({
        data: {
            date: data.date,
            evaluatedAt: data.evaluatedAt,
            person,
            result: data.result,
            testKitName: data.testKitName || '',
            age: dayjs().diff(data.birthday, 'years'),
            cwa: data.cwa,
            locationId: data.slot.locationId,
        }
    });
}