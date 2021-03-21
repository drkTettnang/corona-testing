import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../lib/Config';
import { WelcomeTextTemplate } from '../lib/templates';

const WelcomeText: WelcomeTextTemplate = () => {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Kommunale Corona-Schnellteststation Tettnang</Typography>

            <Typography variant="body1" paragraph={true}>
                In kleinen Schritten zurück in die Normalität, denn Normalität ist das, wonach wir uns wohl
                alle sehnen. Einer dieser kleinen Schritte, die uns auf diesem Weg unterstützen sollen, sind
                die Schnelltests.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Ab Montag, den 22.03.2021 bis zunächst vorläufig Ende März 2021 können sich alle im Rahmen
                des bundesweiten Bürgertestangebots auch in der kommunalen Corona-Schnellteststation in der
                DRK-Geschäftsstelle, Loretostr. 12, 88069 Tettnang freiwillig und kostenlos testen
                lassen (im Rahmen der vorhandenen Testkapazitäten). Eine Registrierung
                ist immer <strong>bis zum Tag davor</strong> möglich.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Weitere Informationen erhalten
                Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}

export default WelcomeText;