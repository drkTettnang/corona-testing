import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import { insertIntoArchiv } from '../../../lib/prisma';
import moderatorRequired from '../../../lib/middleware/moderatorRequired';
import { getSession } from 'next-auth/client';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(moderatorRequired);

handler.post(async (req, res) => {
    const session = await getSession({ req });

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const birthday = new Date(req.body.birthday);
    const date = new Date(req.body.date);
    const evaluatedAt = new Date(req.body.evaluatedAt);
    const result = req.body.result;
    const testKitName = req.body.testKitName;

    if (!firstName || typeof firstName !== 'string') {
        res.status(400).json({ result: 'error', message: 'First name is required' });
        return;
    }

    if (!lastName || typeof lastName !== 'string') {
        res.status(400).json({ result: 'error', message: 'Last name is required' });
        return;
    }

    if (isNaN(birthday.getTime()) || birthday > new Date()) {
        res.status(400).json({ result: 'error', message: 'Birthday is required' });
        return;
    }

    if (isNaN(date.getTime()) || date > new Date()) {
        res.status(400).json({ result: 'error', message: 'Booking date is required' });
        return;
    }

    if (isNaN(evaluatedAt.getTime()) || evaluatedAt > new Date()) {
        res.status(400).json({ result: 'error', message: 'Evaluated date is required' });
        return;
    }

    if (!['positiv', 'negativ', 'invalid'].includes(result)) {
        res.status(400).json({ result: 'error', message: 'Result is not allowed' });
        return;
    }

    if (!testKitName || typeof testKitName !== 'string') {
        res.status(400).json({ result: 'error', message: 'Test kit name is required' });
        return;
    }

    try {
        const archivEntry = await insertIntoArchiv({
            firstName,
            lastName,
            birthday,
            date,
            evaluatedAt,
            result,
            testKitName,
        });

        console.log(`${session.user?.email} added archiv entry ${archivEntry.id}`);

        res.status(200).json(archivEntry);
    } catch (err) {
        res.status(500).json({ result: 'error', message: err.toString() });
    }
});

export default handler;