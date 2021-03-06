import crypto from 'crypto';

export function getMac(message: string): string {
    if (!process.env.SECRET) {
        throw new Error('No secret provided');
    }

    return crypto.createHmac('sha1', process.env.SECRET + ':sualko')
        .update(message.toString())
        .digest('hex');
}

export function verifyMac(message: string, mac: string): boolean {
    return getMac(message) === mac;
}