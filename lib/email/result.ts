import { Booking } from "@prisma/client";
import { htmlToText } from "html-to-text";
import { render } from "mjml-react";
import Result from "../../templates/email/Result";
import { generatePublicId } from "../helper";
import { getMac } from "../hmac";
import smtp from "../smtp";
import Config from '../Config';
import { ResultTemplate } from "../templates";

function generateBody(data: { name: string, booking: Booking, certificateUrl: string }, resultTemplate: ResultTemplate) {
    const HTML = render(resultTemplate(data), {
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
        console.log('Errors while rendering result template:', HTML.errors);
    }

    return {
        html: HTML.html,
        plain,
    };
}

const getCertificateUrl = (booking: Booking) => {
    const mac = getMac(booking.id.toString());

    return (process.env.NEXTAUTH_URL.endsWith('/') ? process.env.NEXTAUTH_URL : process.env.NEXTAUTH_URL + '/') + `certificate/${mac}-${booking.id}.pdf`;
}

export async function sendResultEmail(booking: Booking) {
    const name = (booking.firstName + ' ' + booking.lastName).replace('/<>/', '');

    const certificateUrl = ['positiv', 'negativ'].includes(booking.result) ? getCertificateUrl(booking) : undefined;

    const body = generateBody({
        name,
        booking,
        certificateUrl
    }, Result);

    return smtp.sendMail({
        to: booking.email,
        replyTo: Config.REPLY_TO,
        subject: `Ihr Ergebnis zur Corona Schnelltestung (#${generatePublicId(booking.id)})`,
        text: body.plain,
        html: body.html,
    });
}
