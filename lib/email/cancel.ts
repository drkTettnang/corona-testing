import { Booking } from "@prisma/client";
import { htmlToText } from "html-to-text";
import { render } from "mjml-react";
import Cancel from "../../templates/email/Cancel";
import { generatePublicId } from "../helper";
import smtp from "../smtp";
import Config from '../Config';
import { CancelTemplate } from "../templates";

function generateBody(data: { booking: Booking }, cancelTemplate: CancelTemplate) {
    const HTML = render(cancelTemplate(data), {
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
        console.log('Errors while rendering cancel template:', HTML.errors);
    }

    return {
        html: HTML.html,
        plain,
    };
}

export async function sendCancelationEmail(booking: Booking) {
    const body = generateBody({ booking }, Cancel);

    return smtp.sendMail({
        to: booking.email,
        replyTo: Config.REPLY.TO,
        subject: `Ihr Termin wurde storniert (#${generatePublicId(booking.id)})`,
        text: body.plain,
        html: body.html,
    });
}
