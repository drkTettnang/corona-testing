import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';
import { sleep } from "../../lib/helper";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ result: 'error' });
        return;
    }

    const code = req.body?.code?.toString() || '';
    const slotId = parseInt(req.body?.slotId, 10);

    if (isNaN(slotId) || slotId < 0) {
        res.status(400).json({ result: 'error', message: 'Invalid slot id' });
        return;
    }

    const slot = await prisma.slot.findUnique({
        where: {
            id: slotId,
        }
    });

    if (!slot) {
        res.status(400).json({ result: 'error', message: 'Slot does not exist' });
        return;
    }

    // brute force throttle
    await sleep(3);

    res.status(200).json({
        result: code.toLowerCase() === slot.code.toLowerCase() ? 'valid' : 'invalid',
    });
}