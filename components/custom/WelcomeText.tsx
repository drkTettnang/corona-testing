import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../../lib/Config';

export default function WelcomeText() {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Kommunales Corona-Schnelltestzentrum Meckenbeuren</Typography>

            <Typography variant="body1" paragraph={true}>
                Corona-Tests können einen wichtigen Beitrag für die frühzeitige Erkennung einer Corona-Infektion leisten.
                Die Gemeinde möchte zur Eindämmung der Corona-Pandemie einen weiteren Beitrag leisten, indem sie ein
                Schnelltestzentrum gemeinsam mit dem DRK Ortsverein Tettnang e.V. betreibt.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Ab Dienstag, den 23.03.2021 haben deshalb <strong>alle Bürgerinnen und Bürger</strong> die Möglichkeit,
                sich dienstags und donnerstags, jeweils 17:30 - 20:30 Uhr, kostenlos im <strong>kommunalen
                    Schnelltestzentrum</strong> in Kehlen testen zu lassen.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Adresse: <strong>Dorfgemeinschaftshaus Kehlen, Hügelstraße 11, 88074 Meckenbeuren</strong>.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Weitere Informationen erhalten Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}