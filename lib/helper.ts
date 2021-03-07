import { Booking } from '@prisma/client';
import dayjs from 'dayjs';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import Config from './Config';
import Luhn from './luhn';

dayjs.extend(weekOfYearPlugin);

export function getNumberOfRemainingDates(bookings: Booking[], date = new Date()): number {
    const weekNumber = dayjs(date).week();
    let weekCount = 0;

    if (Config.MAX_DATES < 0 && Config.MAX_CHILDREN < 0) {
        return -1;
    }

    if (Config.MAX_DATES > -1 && bookings.length >= Config.MAX_DATES) {
        return 0;
    }

    if (Config.MAX_DATES_PER_WEEK > -1 && bookings) {
        const days: string[] = [];

        for(const booking of bookings) {
            const date = dayjs(booking.date);

            if (date.week() === weekNumber && !days.includes(date.format('YYYY-MM-DD'))) {
                days.push(date.format('YYYY-MM-DD'));

                weekCount++;
            }
        }

        if (weekCount >= Config.MAX_DATES_PER_WEEK) {
            return 0;
        }
    }

    if (Config.MAX_DATES > -1 && Config.MAX_DATES_PER_WEEK > -1) {
        return Math.max(0, Math.min(Config.MAX_DATES - bookings.length, Config.MAX_DATES_PER_WEEK - weekCount));
    }

    if (Config.MAX_DATES > -1) {
        return Math.max(0, Config.MAX_DATES - bookings.length);
    }

    return Math.max(0, Config.MAX_DATES_PER_WEEK - weekCount);
}

export function sleep(seconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

export function generatePublicId(id: number): string {
    return Luhn.generate(id + 100); //@TODO Config.MIN_PUBLIC_ID
}

export function parsePublicId(id: string|number): number {
    return parseInt(id.toString().slice(0, -1), 10) - 100; //@TODO Config.MIN_PUBLIC_ID
}

export function isValidPublicId(id: string|number): boolean {
    return parseInt(id.toString(), 10) >= 100 && Luhn.validate(id); //@TODO Config.MIN_PUBLIC_ID
}