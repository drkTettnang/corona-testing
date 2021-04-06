import { Booking, Slot, Location } from "@prisma/client";
import dayjs from "dayjs";
import { htmlToText } from "html-to-text";
import { render } from "mjml-react";
import Confirmation from "../../templates/email/Confirmation";
import Config from "../Config";
import generateIcal from "../ical";
import smtp from "../smtp";
import { ConfirmationTemplate } from "../templates";

function generateBody(data: { slot: Slot & { location: Location }, bookings: Booking[] }, confirmationTemplate: ConfirmationTemplate) {
    const HTML = render(confirmationTemplate(data), {
        validationLevel: 'soft',
        minify: undefined,
    });
    const plain = htmlToText(HTML.html, {
        tags: {
            img: {
                format: 'skip',
            },
        }
    });

    if (process.env.NODE_ENV !== 'production' && HTML.errors.length > 0) {
        console.log('Errors while rendering confirmation template:', HTML.errors);
    }

    return {
        html: HTML.html,
        plain,
    };
}

export async function sendConfirmationEmail(slot: Slot & { location: Location }, receiver: string, bookings: Booking[]) {
    const endDate = dayjs(slot.date).add(15, 'minute').toDate();
    const summary = 'Corona Schnelltestung';
    const location = slot.location.address;

    const body = generateBody({ slot, bookings }, Confirmation);

    const icalFile = generateIcal(slot.date, endDate, summary, body.plain, location, {
        name: Config.VENDOR_NAME,
        email: process.env.SMTP_FROM,
    });

    return smtp.sendMail({
        to: receiver,
        replyTo: Config.REPLY.TO,
        subject: 'Erfolgreiche Anmeldung zum Corona Schnelltest',
        text: body.plain,
        html: body.html,
        icalEvent: {
            content: icalFile.toString()
        }
    });
}
