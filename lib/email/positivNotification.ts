import { Booking } from "@prisma/client";
import { generatePublicId } from "../helper";
import smtp from "../smtp";

export async function sendPositivNotification(booking: Booking) {
    if (booking.result !== 'positiv' || !process.env.POSITIV_NOTIFICATION) {
        return;
    }

    const publicId = generatePublicId(booking.id);

    return smtp.sendMail({
        to: process.env.POSITIV_NOTIFICATION,
        subject: `Positives Corona Schnelltest Ergebnis (#${publicId})`,
        text: `Positives Ergebnis für Buchung #${publicId}. ${process.env.NEXTAUTH_URL}`,
    });
}
