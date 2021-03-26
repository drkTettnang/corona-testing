import React from "react";
import { ConfirmationTemplate } from "../../lib/templates"
import {
    Mjml,
    MjmlHead,
    MjmlAttributes,
    MjmlAll,
    MjmlPreview,
    MjmlBody,
    MjmlSection,
    MjmlColumn,
    MjmlImage,
    MjmlText,
} from 'mjml-react';
import Config from "../../lib/Config";
import Footer from "./sections/Footer";
import { generatePublicId } from "../../lib/helper";


const Confirmation: ConfirmationTemplate = ({ slot, bookings }) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlAll fontFamily="Helvetica Neu, Arial" />
                </MjmlAttributes>
                <MjmlPreview>Ihre Anmeldung im kommunalen Testzentrum Tettnang</MjmlPreview>
            </MjmlHead>
            <MjmlBody>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlImage width="150px" alt={`Logo ${Config.VENDOR_NAME}`} src={`${process.env.NEXTAUTH_URL?.replace(/\/$/, '')}${Config.LOGO_EMAIL}`} align="right"></MjmlImage>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <h1>Ihre Buchung war erfolgreich</h1>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <p>Guten Tag,</p>

                            <p>Vielen Dank für ihre Anmeldung in {slot.location.address}. Bitte beachten Sie die Hinweise zur Anfahrt und Durchführung auf unserer <a href={Config.HOMEPAGE}>Corona-Infoseite</a>.</p>

                            <p>Bitte vergessen Sie nicht einen Lichtbildausweis, sowie für Minderjährige, die Einverständniserklärung mitzubringen.</p>

                            <p>Mit freundlichen Grüßen,<br />
                            Ihr DRK Team Tettnang</p>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <p><em>Ihre Anmeldung am {(new Date(slot.date)).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}:</em><br />
                                {bookings.map(booking => (
                                    <span key={booking.id}>
                                        #{generatePublicId(booking.id)}, {booking.firstName} {booking.lastName}, {booking.street}, {booking.postcode} {booking.city}, {(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}<br />
                                    </span>
                                ))}
                            </p>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>

                <Footer />
            </MjmlBody>
        </Mjml>
    )
}

export default Confirmation;