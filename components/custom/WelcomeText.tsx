import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../../lib/Config';

export default function WelcomeText() {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Corona-Schnellteststation Meckenbeuren</Typography>

            <Typography variant="body1" paragraph={true}>
                Im Rahmen der Landtagswahlen am 14. März haben Wahlhelfer und von der Gemeinde Meckenbeuren
                berechtigte Personen die Möglichkeit sich kostenlos auf das Sars-CoV-2 testen zu lassen.
                Die Teststation wird von ehrenamtlichen Helfern des DRK Ortsvereins Tettnang e.V.
                im "Kultur am Gleis 1", Bahnhofplatz 1, 88074 Meckenbeuren, betrieben.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Weitere Informationen erhalten Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}