import React from "react";
import { CancelTemplate } from "../../lib/templates"
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
import Footer from "./sections/Footer";
import { generatePublicId } from "../../lib/helper";

const Cancel: CancelTemplate = ({ booking }) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlAll fontFamily="Helvetica Neu, Arial" />
                </MjmlAttributes>
                <MjmlPreview>Ihr Termin wurde storniert</MjmlPreview>
            </MjmlHead>
            <MjmlBody>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlImage width="150px" alt="DRK Logo" src={`${process.env.NEXTAUTH_URL?.replace(/\/$/, '')}/drk-logo.svg`} align="right"></MjmlImage>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <h1>Terminreservierung storniert</h1>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <p>Guten Tag {booking.firstName} {booking.lastName},</p>

                            <p>Ihr Termin ({(new Date(booking.date)).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}) für die Corona-Schnelltestung wurde storniert.</p>

                            <p>Bei Fragen melden Sie sich bitte über die untere Kontaktadresse oder als Antwort auf diese E-Mail.</p>

                            <p>Mit freundlichen Grüßen,<br />
                            Ihr DRK Team Tettnang</p>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <p><em>Ihre Anmeldung:</em><br />
                                #{generatePublicId(booking.id)}, {booking.firstName} {booking.lastName}
                            </p>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <Footer />
            </MjmlBody>
        </Mjml>
    )
}

export default Cancel;
