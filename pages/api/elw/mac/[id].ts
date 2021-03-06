import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import { isModerator } from '../../../../lib/authorization';
import { getMac } from '../../../../lib/hmac';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    if (!isModerator(session)) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const id = parseInt(req.query.id?.toString(), 10);

    if (isNaN(id) || id <= 0) {
        res.status(400).json({ result: 'error', message: 'Invalid id' });
        return;
    }

    res.status(200).json({
        mac: getMac(id.toString()),
    });
}