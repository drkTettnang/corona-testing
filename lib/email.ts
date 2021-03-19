import { Booking, Slot, Location } from "@prisma/client";
import dayjs from "dayjs";
import Config from "./Config";
import { generatePublicId } from "./helper";
import { getMac } from "./hmac";
import generateIcal from "./ical";
import smtp from "./smtp";

const confirmationHTML = (bookings: Booking[], location: string) => {
    // Some simple styling options
    const backgroundColor = '#f9f9f9'
    const textColor = '#444444'
    const mainBackgroundColor = '#ffffff'

    // Uses tables for layout and inline CSS due to email client limitations
    return `
  <body style="background: ${backgroundColor};">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          <strong>Kommunale Corona-Schnellteststation</strong>
        </td>
      </tr>
    </table>
    <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="right" style="font-size: 12px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">DRK Ortsverein Tettnang e.V.</td>
      </tr>
      <tr>
        <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          Terminreservierung war erfolgreich
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          Vielen Dank für ihre Anmeldung in ${location}. Bitte beachten Sie die Hinweise zur Anfahrt und Durchführung auf unserer <a href="${Config.HOMEPAGE}">Informationsseite</a>.<br />
          <br />
          Bitte vergessen Sie nicht einen Lichtbildausweis, den Berechtigungsnachweis, sowie für Minderjährige, die Einverständniserklärung mitzubringen.<br />
          <br />
          Mit freundlichen Grüßen,<br />
          Ihr DRK Team Tettnang<br />
          <br />
          <br />
          Ihre Anmeldung:<br />
          ${bookings.map(booking => `#${generatePublicId(booking.id)}, ${booking.firstName} ${booking.lastName}, ${booking.street}, ${booking.postcode} ${booking.city}, ${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}`).join('<br />')}
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 10px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            ${Config.VENDOR_ADDRESS.join(' - ')}
        </td>
      </tr>
    </table>
  </body>
  `
};

const confirmationPlain = (bookings: Booking[], location: string) => {
    return `Guten Tag,

Ihre Terminreservierung war erfolgreich.

Vielen Dank für ihre Anmeldung in ${location}. Bitte beachten Sie die Hinweise zur Anfahrt und Durchführung auf unserer Informationsseite [1].

Bitte vergessen Sie nicht einen Lichtbildausweis, den Berechtigungsnachweis, sowie für Minderjährige, die Einverständniserklärung mitzubringen.

Mit freundlichen Grüßen,
Ihr DRK Team Tettnang

[1] ${Config.HOMEPAGE}

Ihre Anmeldung:
${bookings.map(booking => `#${generatePublicId(booking.id)}, ${booking.firstName} ${booking.lastName}, ${booking.street}, ${booking.postcode} ${booking.city}, ${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}`).join('\n')}

--
${Config.VENDOR_ADDRESS.join('\n')}

${Config.CONTACT_MAIL}
${Config.HOMEPAGE}

`
}

export async function sendConfirmationEmail(slot: Slot & {location: Location}, receiver: string, bookings: Booking[]) {
    const endDate = dayjs(slot.date).add(30, 'minute').toDate();
    const summary = 'Corona Schnelltestung';
    const location = slot.location.address;

    const icalFile = generateIcal(slot.date, endDate, summary, confirmationPlain(bookings, location), location, {
        name: Config.VENDOR_NAME,
        email: process.env.SMTP_FROM,
    });

    return smtp.sendMail({
        to: receiver,
        subject: 'Erfolgreiche Anmeldung zum Corona Schnelltest',
        text: confirmationPlain(bookings, location),
        html: confirmationHTML(bookings, location),
        icalEvent: {
            content: icalFile.toString()
        }
    });
}

const verificationRequestHTML = ({ url, site, email }) => {
    // Insert invisible space into domains and email address to prevent both the
    // email address and the domain from being turned into a hyperlink by email
    // clients like Outlook and Apple mail, as this is confusing because it seems
    // like they are supposed to click on their email address to sign in.
    const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`
    const escapedSite = `${site.replace(/\./g, '&#8203;.')}`

    // Some simple styling options
    const backgroundColor = '#f9f9f9'
    const textColor = '#444444'
    const mainBackgroundColor = '#ffffff'
    const buttonBackgroundColor = '#f44336'
    const buttonBorderColor = '#bf2d23'
    const buttonTextColor = '#ffffff'

    // Uses tables for layout and inline CSS due to email client limitations
    return `
  <body style="background: ${backgroundColor};">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          <strong>${escapedSite}</strong>
        </td>
      </tr>
    </table>
    <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          Anmelden mit <strong>${escapedEmail}</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Anmelden</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          Sollten Sie diese E-Mail nicht angefordert haben, können Sie diese einfach ignorieren.
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 10px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          ${Config.VENDOR_ADDRESS.join(' - ')}
        </td>
      </tr>
    </table>
  </body>
  `
}

const verificationRequestPlain = ({ url, site }) => `Anmelden auf ${site}
${url}

--
${Config.VENDOR_ADDRESS.join('\n')}

${Config.CONTACT_MAIL}
${Config.HOMEPAGE}

`

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

        smtp
            .sendMail({
                to: email,
                from,
                subject: `Anmeldung ${site}`,
                text: verificationRequestPlain({ url, site }),
                html: verificationRequestHTML({ url, site, email })
            }, (error) => {
                if (error) {
                    console.log(`Could not send verification request to "${email}"`, error.toString());

                    return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR'));
                }

                return resolve();
            })
    })
}

const resultHTML = ({ name, result, notice, booking, certificateUrl }) => {
  // Some simple styling options
  const backgroundColor = '#f9f9f9'
  const textColor = '#444444'
  const mainBackgroundColor = '#ffffff'

  // Uses tables for layout and inline CSS due to email client limitations
  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>Ergebnis Schnelltestung!</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="right" style="font-size: 12px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        DRK Ortsverein Tettnang e.V.<br /><br /><br /><br />
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Guten Tag ${name},<br />
        <br />
        Ihr Schnelltest wurde ausgewertet und das Ergebnis lautet: <b>${result}</b>.<br />
        <br />
        ${notice}<br />${certificateUrl ? `
        <br />
        Ihre <a href="${certificateUrl}">Bescheinigung über das Ergebnis</a> steht 14 Tage zum Download bereit.<br />` : ''}
        <br />
        Weitere Informationen rund um die Bedeutung ihres Testergebnisses erhalten Sie auf unserer <a href="${Config.HOMEPAGE}">Corona-Infoseite</a>.<br />
        <br />
        Mit freundlichen Grüßen,<br />
        Ihr DRK Team Tettnang
        <br />
        <br />
        Ihre Daten:<br />
        ${booking.street}<br />
        ${booking.postcode} ${booking.city}<br />
        ${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}<br />
        Ergebnis: ${result}<br />
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 10px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        ${Config.VENDOR_ADDRESS.join(' - ')}
      </td>
    </tr>
  </table>
</body>
`
};

const resultPlain = ({ name, result, notice, booking, certificateUrl }) => `Guten Tag ${name},

Ihr Schnelltest wurde ausgewertet und das Ergebnis lautet: ${result}.

${notice}${certificateUrl ? ` Unter [2] können Sie sich eine Bescheinigung über das Ergebnis herunterladen.` : ''}

Weitere Informationen rund um die Bedeutung ihres Testergebnisses erhalten Sie auf unserer Corona-Infoseite [1].

Mit freundlichen Grüßen,
Ihr DRK Team Tettnang

Ihre Daten:
${booking.street}
${booking.postcode} ${booking.city}
${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}
Ergebnis: ${result}

[1] ${Config.HOMEPAGE}${certificateUrl ? `
[2] ${certificateUrl}` : ''}

--
${Config.VENDOR_ADDRESS.join('\n')}

${Config.CONTACT_MAIL}
${Config.HOMEPAGE}

`

const getCertificateUrl = (booking: Booking) => {
  const mac = getMac(booking.id.toString());

  return (process.env.NEXTAUTH_URL.endsWith('/') ? process.env.NEXTAUTH_URL : process.env.NEXTAUTH_URL + '/') + `certificate/${mac}-${booking.id}.pdf`;
}

export async function sendResultEmail(booking: Booking) {
  const results = {
    invalid: 'ungültig',
    unknown: 'unbekannt',
    positiv: 'positiv',
    negativ: 'negativ',
  };
  const notices = {
    invalid: 'Leider ist ihr Test fehlgeschlagen. Das Ergebnis ist damit nicht auswertbar.',
    unknown: 'Leider konnte kein Ergebnis ermittelt werden.',
    positiv: 'Bitte beachten Sie, dass Sie sich ab sofort bis zur Vorlage eines negativen PCR-Testergebnisses in Absonderung begeben müssen (Corona-Verordnung Absonderung). Weitere Information finden Sie im Hinweisschreiben "Mein Test ist positiv", welches Sie auf unserer Webseite finden.',
    negativ: 'Ihr Testergebnis ist negativ, aber bitte beachten Sie, dass diese Tests unter Umständen ein falsches Ergebnis anzeigen können. Bitte beachten Sie weiterhin die AHA Regeln.',
  };
  const name = (booking.firstName + ' ' + booking.lastName).replace('/<>/', '');

  const certificateUrl = ['positiv', 'negativ'].includes(booking.result) ? getCertificateUrl(booking) : undefined;

  return smtp.sendMail({
      to: booking.email,
      subject: `Ihr Ergebnis zur Corona Schnelltestung (#${generatePublicId(booking.id)})`,
      text: resultPlain({name, result: results[booking.result], notice: notices[booking.result], booking, certificateUrl}),
      html: resultHTML({name, result: results[booking.result], notice: notices[booking.result], booking, certificateUrl}),
  });
}