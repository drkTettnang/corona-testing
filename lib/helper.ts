import { Booking } from '@prisma/client';
import dayjs from 'dayjs';
import weekOfYearPlugin from 'dayjs/plugin/weekOfYear';
import Config from './Config';

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