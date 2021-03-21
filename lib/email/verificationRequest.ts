import smtp from "../smtp";
import { VerificationRequestTemplate } from "../templates";
import { render } from 'mjml-react';
import { htmlToText } from 'html-to-text';
import VerificationRequest from "../../templates/email/VerificationRequest";

function generateBody(data: { url: string, site: string, email: string }, verificationRequestTemplate: VerificationRequestTemplate) {
    const HTML = render(verificationRequestTemplate(data), {validationLevel: 'soft'});
    const plain = htmlToText(HTML.html, {
        tags: {
            img: {
                format: 'skip',
            },
        }
    });

    if (process.env.NODE_ENV !== 'production' && HTML.errors.length > 0) {
        console.log('Errors while rendering verification request template:', HTML.errors);
    }

    return {
        html: HTML.html,
        plain,
    };
}

export const sendVerificationRequest = ({ identifier: email, url, token, baseUrl, provider }) => {
    return new Promise<void>((resolve, reject) => {
        const { from } = provider
        // Strip protocol from URL and use domain as site name
        const site = baseUrl.replace(/^https?:\/\//, '');

        if (!email || /[,;]/.test(email) || email.indexOf('@') < 1) {
            console.log(`Mail address ("${email}") not valid`);

            reject(new Error('SEND_VERIFICATION_EMAIL_ERROR'));

            return;
        }

        const body = generateBody({ url, site, email }, VerificationRequest);

        smtp
            .sendMail({
                to: email,
                from,
                subject: `Anmeldung ${site}`,
                text: body.plain,
                html: body.html,
            }, (error) => {
                if (error) {
                    console.log(`Could not send verification request to "${email}"`, error.toString());

                    return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR'));
                }

                return resolve();
            })
    })
}