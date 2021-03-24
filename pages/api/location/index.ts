import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nc from "next-connect";
import { isModerator } from "../../../lib/authorization";
import Config from "../../../lib/Config";
import { isJSON } from "../../../lib/helper";
import moderatorRequired from "../../../lib/middleware/moderatorRequired";
import prisma from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const session = await getSession({ req });

    const query = (!session || !isModerator(session)) ?
        `SELECT locations.*, SUM(slots.seats) AS seats, COUNT(bookings.id) AS occupied FROM locations LEFT JOIN slots ON locations.id = slots.location_id LEFT JOIN bookings ON slots.id = bookings.slot_id WHERE DATE(slots.date) > CURDATE() AND DATE(slots.date) <= (CURDATE() + INTERVAL ${Config.MAX_DAYS} DAY) GROUP BY locations.id HAVING SUM(slots.seats) > 0`
        :
        'SELECT locations.*, SUM(slots.seats) AS seats, COUNT(bookings.id) AS occupied FROM locations LEFT JOIN slots ON locations.id = slots.location_id LEFT JOIN bookings ON slots.id = bookings.slot_id GROUP BY locations.id';

    const locations = await prisma.$queryRaw<Location & {seats: number, occupied: number}>(query)

    res.json(locations);
});

const restrictedHandler = nc<NextApiRequest, NextApiResponse>();

restrictedHandler.use(moderatorRequired);

restrictedHandler.post(async (req, res) => {
    if (!isJSON(req)) {
        res.status(400).json({ result: 'error', message: 'Only JSON is accepted' });
        return;
    }

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