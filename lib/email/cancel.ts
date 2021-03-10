import { Booking } from "@prisma/client";
import Config from "../Config";
import { generatePublicId } from "../helper";
import smtp from "../smtp";

const cancelationHTML = (booking: Booking) => {
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
          Terminreservierung storniert
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          Ihr Termin (${(new Date(booking.date)).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}) für die Corona-Schnelltestung wurde storniert.<br />
          <br />
          Bei Fragen melden Sie sich bitte über die untere Kontaktadresse oder als Antwort auf diese E-Mail.<br />
          <br />
          Mit freundlichen Grüßen,<br />
          Ihr DRK Team Tettnang<br />
          <br />
          <br />
          Ihre Anmeldung:<br />
          #${generatePublicId(booking.id)}, ${booking.firstName} ${booking.lastName}
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

const cancelationPlain = (booking: Booking) => {
    return `Guten Tag,

Ihr Termin (${(new Date(booking.date)).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}) für die Corona-Schnelltestung wurde storniert.

Bei Fragen melden Sie sich bitte über die untere Kontaktadresse oder als Antwort auf diese E-Mail.

Mit freundlichen Grüßen,
Ihr DRK Team Tettnang

Ihre Anmeldung:
#${generatePublicId(booking.id)}, ${booking.firstName} ${booking.lastName}

--
${Config.VENDOR_ADDRESS.join('\n')}

${Config.CONTACT_MAIL}
${Config.HOMEPAGE}

`
}

export async function sendCancelationEmail(booking: Booking) {
    return smtp.sendMail({
        to: booking.email,
        subject: `Ihr Termin wurde storniert (#${generatePublicId(booking.id)})`,
        text: cancelationPlain(booking),
        html: cancelationHTML(booking),
    });
}