import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../../lib/Config';

export default function WelcomeText() {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Kommunale Corona-Schnellteststation Neukirch</Typography>

            <Typography variant="body1" paragraph={true}>
                In kleinen Schritten zurück in die Normalität, denn Normalität ist das, wonach wir uns wohl
                alle sehnen. Einer dieser kleinen Schritte, die uns auf diesem Weg unterstützen sollen, sind
                die Schnelltests. Daher betreibt der DRK Ortsverein Tettnang e.V. im Auftrag der Gemeinde Neukirch
                im Dorfgemeinschaftshaus Wildpoltsweiler, Am Dorfbach 6, 88099 Wilpoltsweiler, eine Teststation
                mit ehrenamtlichen Helfern.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Weitere Informationen erhalten Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}