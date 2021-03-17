import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import moderatorRequired from "../../../lib/middleware/moderatorRequired";
import prisma from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const locations = await prisma.location.findMany({
        orderBy: {
            address: 'asc',
        }
    });

    res.json(locations);
});

const restrictedHandler = nc<NextApiRequest, NextApiResponse>();

restrictedHandler.use(moderatorRequired);

restrictedHandler.post(async (req, res) => {
    const address = req.body?.address || '';
    const name = req.body?.name || '';
    const description = req.body?.description || '';
    const rollingBooking = typeof req.body?.rollingBooking === 'boolean' ? req.body?.rollingBooking : false;

    if (!address || !name) {
        res.status(400).json({ result: 'error', message: 'Address and name are required' });
        return;
    }

    const location = await prisma.location.create({
        data: {
            address,
            description,
            name,
            rollingBooking,
        }
    });

    res.json(location);
});

handler.use(restrictedHandler);

export default handler;