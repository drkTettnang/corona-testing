import crypto from 'crypto';

export function getMac(message: string, salt = ':sualko'): string {
    if (!process.env.SECRET) {
        throw new Error('No secret provided');
    }

    return crypto.createHmac('sha1', process.env.SECRET + salt)
        .update(message.toString())
        .digest('hex');
}

export function verifyMac(message: string, mac: string, salt?: string): boolean {
    return getMac(message, salt) === mac;
}