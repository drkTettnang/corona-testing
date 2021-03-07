import { Session } from "next-auth/client";
import type { NextApiRequest } from 'next'
import { getMac } from "./hmac";
import dayjs from "dayjs";

export function isModerator(session: Session) {
    return session &&
        process.env.MODERATORS &&
        session.user?.email &&
        process.env.MODERATORS.split(',').includes(session.user?.email);
}

export function useAuthHeader(req: NextApiRequest): boolean {
    const authorization = req.headers?.authorization;

    if (!authorization) {
        return false;
    }

    const typeCredentials = authorization.split(' ');

    if (typeCredentials.length !== 2 || typeCredentials[0] !== 'Basic') {
        return false;
    }

    const usernamePassword = Buffer.from(typeCredentials[1], 'base64').toString('ascii').split(':');

    if (usernamePassword.length !== 2 || !/^\d{4}-\d{2}-\d{2}$/.test(usernamePassword[0]) || usernamePassword[1].length !== 40) {
        return false;
    }

    const dayKey = dayjs().format('YYYY-MM-DD');

    if (dayKey !== usernamePassword[0]) {
        return false;
    }

    return getMac(dayKey, ':station') === usernamePassword[1];
}