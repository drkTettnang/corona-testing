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
        `SELECT locations.id,
                locations.name,
                locations.address,
                locations.description,
                locations.rolling_booking AS rollingBooking,
                locations.test_kit_name as testKitName,
                SUM(s.seats) AS seats,
                SUM(s.occupied) AS occupied
         FROM locations
         LEFT JOIN (
            SELECT slots.*, COUNT(bookings.id) AS occupied
            FROM slots
            LEFT JOIN bookings ON slots.id = bookings.slot_id
            GROUP BY slots.id
         ) AS s ON s.location_id = locations.id
         WHERE DATE(s.date) > CURDATE() AND DATE(s.date) <= (CURDATE() + INTERVAL ${Config.MAX_DAYS} DAY)
         GROUP BY locations.id HAVING SUM(s.seats) > 0`
        :
        `SELECT locations.id,
                locations.name,
                locations.address,
                locations.description,
                locations.rolling_booking AS rollingBooking,
                locations.test_kit_name as testKitName,
                SUM(s.seats) AS seats,
                SUM(s.occupied) AS occupied
         FROM locations
         LEFT JOIN (
            SELECT slots.*, COUNT(bookings.id) AS occupied
            FROM slots
            LEFT JOIN bookings ON slots.id = bookings.slot_id
            GROUP BY slots.id
            HAVING slots.date > NOW()
         ) AS s ON s.location_id = locations.id
         GROUP BY locations.id`;

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
    const testKitName = req.body?.testKitName || '';
    const description = req.body?.description || '';
    const rollingBooking = typeof req.body?.rollingBooking === 'boolean' ? req.body?.rollingBooking : false;

    if (!address || !name || !testKitName) {
        res.status(400).json({ result: 'error', message: 'Address, name and test kit name are required' });
        return;
    }

    const location = await prisma.location.create({
        data: {
            address,
            description,
            name,
            testKitName,
            rollingBooking,
        }
    });

    res.json(location);
});

handler.use(restrictedHandler);

export default handler;