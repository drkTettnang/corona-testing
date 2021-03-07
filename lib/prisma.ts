import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export default prisma;

export function isDay(date = new Date()) {
    const startDate = dayjs(date).hour(0).minute(0).second(0);
    const endDate = startDate.add(1, 'day');

    return {
        gte: startDate.toDate(),
        lt: endDate.toDate(),
    }
}