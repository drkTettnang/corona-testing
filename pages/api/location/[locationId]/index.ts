import type { NextApiResponse } from 'next'
import nc from "next-connect";
import { getSession } from 'next-auth/client';
import prisma from '../../../../lib/prisma';
import moderatorRequired from '../../../../lib/middleware/moderatorRequired';
import location, { LocationRequest } from '../../../../lib/middleware/location';

const handler = nc<LocationRequest, NextApiResponse>();

handler.use(moderatorRequired);
handler.use(location);

handler.put(async (req, res) => {
    const session = await getSession({ req });

    if (!req.location) {
        res.status(500).json({ result: 'error', message: 'Location not found' });
        return;
    }

    const name = req.body?.name;
    const address = req.body?.address;
    const description = req.body?.description;

    if (!name || !address || typeof name !== 'string' || typeof address !== 'string') {
        res.status(400).json({ result: 'error', message: 'Name and address are required' });
        return;
    }

    const location = await prisma.location.update({
        where: {
            id: req.location.id,
        },
        data: {
            name,
            address,
            description,
        },
    });

    console.log(`${session.user?.email} updated location ${location.id}`);

    res.status(200).json(location);
});

export default handler;