import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sleep } from "../../lib/helper";
import { getMac } from "../../lib/hmac";
import prisma, { isDay } from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ result: 'error' });
        return;
    }

    const code = req.body?.code?.toString() || '';

    if (!/^[0-9a-z]{40}$/i.test(code)) {
        res.status(401).json({ result: 'error', message: 'Code is wrong' });
        return;
    }

    const startDate = dayjs().hour(0).minute(0).second(0);

    const slotsToday = await prisma.slot.count({
        where: {
            date: isDay()
        },
    });

    if (slotsToday === 0) {
        res.status(400).json({ result: 'error', message: 'Today are no tests' });
        return;
    }

    // brute force throttle
    await sleep(3);

    res.status(200).json({
        result: code === getMac(startDate.format('YYYY-MM-DD'), ':station') ? 'valid' : 'invalid',
    });
}
