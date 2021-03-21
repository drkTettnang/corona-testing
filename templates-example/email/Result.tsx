import React from "react";
import { ResultTemplate } from "../../lib/templates"
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

const Result: ResultTemplate = ({ name, booking, certificateUrl }) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlAll fontFamily="Helvetica Neu, Arial" />
                </MjmlAttributes>
                <MjmlPreview>Ihr Schnelltest wurde ausgewertet</MjmlPreview>
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
                            <h1>Ergebnis Schnelltestung</h1>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <p>Guten Tag {name},</p>

                            <p>Ihr Schnelltest (#{generatePublicId(booking.id)}) wurde ausgewertet und das Ergebnis lautet: <strong>{results[booking.result]}</strong>.</p>

                            <p>{notices[booking.result]}</p>

                            {certificateUrl && <p>Ihre <a href={certificateUrl}>Bescheinigung über das Ergebnis</a> steht 14 Tage zum Download bereit.</p>}

                            <p>Weitere Informationen rund um die Bedeutung ihres Testergebnisses erhalten Sie auf unserer <a href={Config.HOMEPAGE}>Corona-Infoseite</a>.</p>

                            <p>Mit freundlichen Grüßen,<br />
                            Ihr DRK Team Tettnang</p>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText align="center">
                            <p><em>Ihre Daten:</em><br />
                                #{generatePublicId(booking.id)}<br />
                                {booking.street}<br />
                                {booking.postcode} {booking.city}<br />
                                {(new Date(booking.birthday)).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })}<br />
                                Ergebnis: {results[booking.result]}
                            </p>
                        </MjmlText>
                    </MjmlColumn>
                </MjmlSection>
                <Footer />
            </MjmlBody>
        </Mjml>
    )
}

export default Result;
