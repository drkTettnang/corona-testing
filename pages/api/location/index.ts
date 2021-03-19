import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nc from "next-connect";
import { isModerator } from "../../../lib/authorization";
import moderatorRequired from "../../../lib/middleware/moderatorRequired";
import prisma from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const session = await getSession({ req });

    const where = {};

    if (!session || !isModerator(session)) {
        where['slots'] = {
            some: {
                date: {
                    gte: new Date(),
                },
            },
        };
    }

    const locations = await prisma.location.findMany({
        where,
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