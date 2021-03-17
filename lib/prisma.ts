import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

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