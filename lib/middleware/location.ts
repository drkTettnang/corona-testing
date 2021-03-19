import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { Location } from "@prisma/client";
import prisma from "../prisma";

export interface LocationRequest extends NextApiRequest {
    location: Location
}

export default async function(req: LocationRequest, res: NextApiResponse, next: NextHandler) {
    const locationId = parseInt(req.query.locationId.toString(), 10);

    if (isNaN(locationId) || locationId <= 0) {
        res.status(400).json({ result: 'error', message: 'location id is invalid' });
        return;
    }

    const location = await prisma.location.findUnique({
        where: {
            id: locationId,
        }
    });

    if (!location) {
        res.status(404).json({ result: 'error', message: 'location not found' });
        return;
    }

    req.location = location;

    next();
}