import { Booking } from "@prisma/client";
import dayjs from "dayjs";
import { SLOT_DURATION } from "./const";
import generateIcal from "./ical";
import Luhn from "./luhn";
import smtp from "./smtp";

const confirmationHTML = (bookings: Booking[]) => {
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
          <strong>Stille Nacht - Einsame Nacht? Muss nicht sein!</strong>
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
          Vielen Dank für ihre Anmeldung. Bitte beachten Sie die Hinweise zur Anfahrt und Durchführung auf unserer <a href="https://drk-tettnang.de/testung">Informationsseite</a>.<br />
          <br />
          Mit freundlichen Grüßen,<br />
          Ihr DRK Team Tettnang<br />
          <br />
          <br />
          Ihre Anmeldung:<br />
          ${bookings.map(booking => `#${Luhn.generate(booking.id + 100)}, ${booking.firstName} ${booking.lastName}, ${booking.street}, ${booking.postcode} ${booking.city}, ${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}`).join('<br />')}
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 10px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            Deutsches Rotes Kreuz Ortsverein Tettnang e.V. - Loretostraße 12 - 88069 Tettnang
        </td>
      </tr>
    </table>
  </body>
  `
};

const confirmationPlain = (bookings: Booking[]) => {
    return `Guten Tag,

Ihre Terminreservierung war erfolgreich.

Vielen Dank für ihre Anmeldung. Bitte beachten Sie die Hinweise zur Anfahrt und Durchführung auf unserer Informationsseite [1].

Mit freundlichen Grüßen,
Ihr DRK Team Tettnang

[1] https://drk-tettnang.de/testung

Ihre Anmeldung:
${bookings.map(booking => `#${Luhn.generate(booking.id + 100)}, ${booking.firstName} ${booking.lastName}, ${booking.street}, ${booking.postcode} ${booking.city}, ${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}`).join('\n')}

--
Deutsches Rotes Kreuz
Ortsverein Tettnang e.V.
Loretostraße 12
88069 Tettnang

mail@your.domain
https://drk-tettnang.de/testung

`
}

export async function sendConfirmationEmail(date: Date, receiver: string, bookings: Booking[]) {
    const endDate = dayjs(date).add(SLOT_DURATION, 'minute').toDate();
    const summary = 'Corona Schnelltestung';
    const location = 'Hermannstraße 15, 88069 Tettnang';

    const icalFile = generateIcal(date, endDate, summary, location, {
        name: 'DRK Ortsverein Tettnang e.V.',
        email: 'mail@your.domain',
    });

    return smtp.sendMail({
        to: receiver,
        bcc: process.env.SMTP_FROM,
        subject: 'Erfolgreiche Anmeldung zum Corona Schnelltest',
        text: confirmationPlain(bookings),
        html: confirmationHTML(bookings),
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
            Deutsches Rotes Kreuz Ortsverein Tettnang e.V. - Loretostraße 12 - 88069 Tettnang
        </td>
      </tr>
    </table>
  </body>
  `
}

const verificationRequestPlain = ({ url, site }) => `Anmelden auf ${site}
${url}

--
Deutsches Rotes Kreuz
Ortsverein Tettnang e.V.
Loretostraße 12
88069 Tettnang

mail@your.domain
https://drk-tettnang.de/testung

`

export const sendVerificationRequest = ({ identifier: email, url, token, baseUrl, provider }) => {
    return new Promise<void>((resolve, reject) => {
        const { from } = provider
        // Strip protocol from URL and use domain as site name
        const site = baseUrl.replace(/^https?:\/\//, '')

        smtp
            .sendMail({
                to: email,
                from,
                subject: `Anmeldung ${site}`,
                text: verificationRequestPlain({ url, site }),
                html: verificationRequestHTML({ url, site, email })
            }, (error) => {
                if (error) {
                    return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR'))
                }

                return resolve()
            })
    })
}

const resultHTML = ({ name, result, notice, booking }) => {
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
        ${notice}<br />
        <br />
        Weitere Informationen rund um die Bedeutung ihres Testergebnisses erhalten Sie auf unserer <a href="https://drk-tettnang.de/testung">Corona-Infoseite</a>.<br />
        <br />
        Bitte beachten Sie, dass diese E-Mail rein informativ ist und keinen offiziellen Beleg darstellt.<br />
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
          Deutsches Rotes Kreuz Ortsverein Tettnang e.V. - Loretostraße 12 - 88069 Tettnang
      </td>
    </tr>
  </table>
</body>
`
};

const resultPlain = ({ name, result, notice, booking }) => `Guten Tag ${name},

Ihr Schnelltest wurde ausgewertet und das Ergebnis lautet: ${result}.

${notice}

Weitere Informationen rund um die Bedeutung ihres Testergebnisses erhalten Sie auf unserer Corona-Infoseite [1].

Bitte beachten Sie, dass diese E-Mail rein informativ ist und keinen offiziellen Beleg darstellt.

Mit freundlichen Grüßen,
Ihr DRK Team Tettnang

Ihre Daten:
${booking.street}
${booking.postcode} ${booking.city}
${(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}
Ergebnis: ${result}

[1] https://drk-tettnang.de/testung

--
Deutsches Rotes Kreuz
Ortsverein Tettnang e.V.
Loretostraße 12
88069 Tettnang

mail@your.domain
https://drk-tettnang.de/testung

`

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
    positiv: 'Bitte beachten Sie, dass Sie sich ab sofort bis zur Vorlage eines negativen PCR-Testergebnisses in Absonderung begeben müssen (Corona-Verordnung Absonderung).',
    negativ: 'Ihr Testergebnis ist negativ, aber bitte beachten Sie, dass diese Tests unter Umständen ein falsches Ergebnis anzeigen können. Bitte beachten Sie weiterhin die AHA Regeln.',
  };
  const name = (booking.firstName + ' ' + booking.lastName).replace('/<>/', '');

  return smtp.sendMail({
      to: booking.email,
      bcc: process.env.SMTP_FROM,
      subject: `Ihr Ergebnis zur Corona Schnelltestung (#${Luhn.generate(booking.id + 100)})`,
      text: resultPlain({name, result: results[booking.result], notice: notices[booking.result], booking}),
      html: resultHTML({name, result: results[booking.result], notice: notices[booking.result], booking}),
  });
}