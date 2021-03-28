import type { NextApiRequest } from 'next'
import { getMac } from "./hmac";
import dayjs from "dayjs";
import { Session } from 'next-auth';

export function isModerator(session: Session) {
    return session &&
        process.env.MODERATORS &&
        session.user?.email &&
        process.env.MODERATORS.split(',').includes(session.user?.email);
}

export function useAuthHeader(req: NextApiRequest): number|false {
    const authorization = req.headers?.authorization;

    if (!authorization) {
        return false;
    }

    const typeCredentials = authorization.split(' ');

    if (typeCredentials.length !== 2 || typeCredentials[0] !== 'Basic') {
        return false;
    }

    const usernameLocationPassword = Buffer.from(typeCredentials[1], 'base64').toString('ascii').split(':');

    if (usernameLocationPassword.length !== 3 || !/^\d{4}-\d{2}-\d{2}$/.test(usernameLocationPassword[0]) || !/^\d+$/.test(usernameLocationPassword[1]) || usernameLocationPassword[2].length !== 40) {
        return false;
    }

    const locationId = parseInt(usernameLocationPassword[1], 10);
    const dayKey = dayjs().format('YYYY-MM-DD');

    if (dayKey !== usernameLocationPassword[0] || isNaN(locationId)) {
        return false;
    }

    return getMac(locationId + ':' + dayKey, ':station') === usernameLocationPassword[2] ? locationId : false;
}