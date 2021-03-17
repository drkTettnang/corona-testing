import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { NextHandler } from "next-connect";
import { isModerator } from "../authorization";

export default async function moderatorRequired(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'no_permission' });
        return;
    }

    if (!isModerator(session)) {
        res.status(401).json({ result: 'no_permission' });
        return;
    }

    next();
}