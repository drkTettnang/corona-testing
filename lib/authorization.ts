import { Session } from "next-auth/client";

export function isModerator(session: Session) {
    return session &&
        process.env.MODERATORS &&
        session.user?.email &&
        process.env.MODERATORS.split(',').includes(session.user?.email);
}
