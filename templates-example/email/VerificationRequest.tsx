import React from "react";
import { VerificationRequestTemplate } from "../../lib/templates"
import {
    Mjml,
    MjmlHead,
    MjmlAttributes,
    MjmlAll,
    MjmlPreview,
    MjmlBody,
    MjmlSection,
    MjmlColumn,
    MjmlButton,
    MjmlImage,
    MjmlText
} from 'mjml-react';
import Footer from "./sections/Footer";

const VerificationRequest: VerificationRequestTemplate = ({ url, site, email }) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlAll fontFamily="Helvetica Neu, Arial" />
                </MjmlAttributes>
                <MjmlPreview>Ihre Anmeldung zur Corona Schnelltestung</MjmlPreview>
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
                            <h1>{site}</h1>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center"><p>Ihre E-Mail Adresse <strong>{email}</strong> wurde auf der Seite {site} eingetragen um sich dort anzumelden.</p></MjmlText>

                        <MjmlButton background-color="#f44336" font-weight="bold" href={url}>Anmelden</MjmlButton>

                        <MjmlText align="center"><p>Sollten Sie diese E-Mail nicht angefordert haben, können Sie diese einfach ignorieren.</p></MjmlText>
                    </MjmlColumn>
                </MjmlSection>

                <Footer />
            </MjmlBody>
        </Mjml>
    )
}

export default VerificationRequest;
