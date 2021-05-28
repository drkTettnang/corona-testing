import { Booking, CWAVariant } from '@prisma/client';
import crypto from 'crypto';
import dayjs from 'dayjs';

export default class CWA {
    public static generateSalt(): string {
        return crypto.randomBytes(16).toString('hex').toUpperCase();
    }

    constructor(private booking: Booking) {
        if (booking.cwa !== CWAVariant.light && booking.cwa !== CWAVariant.full) {
            throw new Error('Unsupported CWA variant: ' + booking.cwa);
        }

        if (!booking.salt || booking.salt.length !== 32) {
            throw new Error('Invalid CWA salt: ' + booking.salt);
        }
    }

    private getData() {
        const fn = this.booking.firstName;
        const ln = this.booking.lastName;
        const dob = dayjs(this.booking.birthday).format('YYYY-MM-DD');
        const timestamp = dayjs(this.booking.date).unix();
        const testid = this.booking.id;
        const salt = this.booking.salt;

        return {dob, fn, ln, timestamp, testid, salt};
    }

    public getHash(): string {
        const { fn, ln, dob, timestamp, testid, salt } = this.getData();

        const values = this.booking.cwa === CWAVariant.full ?
            [dob, fn, ln, timestamp, testid, salt]
            :
            [timestamp, salt];

        return crypto.createHash('sha256').update(values.join('#')).digest('hex');
    }

    public getURL(): string {
        const { fn, ln, dob, timestamp, testid, salt } = this.getData();
        const data = this.booking.cwa === CWAVariant.full ? {
            fn,
            ln,
            dob,
            timestamp,
            testid,
            salt,
            hash: this.getHash(),
        } : {
            timestamp,
            salt,
            hash: this.getHash(),
        };

        const hash = typeof Buffer !== 'undefined' ? Buffer.from(JSON.stringify(data)).toString("base64") : btoa(JSON.stringify(data));

        return 'https://s.coronawarn.app?v=1#' + hash;
    }
}