import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../../lib/Config';

export default function WelcomeText() {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Kommunale Corona-Schnellteststation Tettnang</Typography>

            <Typography variant="body1" paragraph={true}>
                In kleinen Schritten zurück in die Normalität, denn Normalität ist das, wonach wir uns wohl
                alle sehnen. Einer dieser kleinen Schritte, die uns auf diesem Weg unterstützen sollen, sind
                die Schnelltests.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Die Teststrategie des Landes Baden-Württemberg wurde zwischenzeitlich fortgeschrieben
                und an die vorsichtige Öffnung der Kindertagesstätten und Schulen angepasst. In der
                Testgruppe 1 wird bereits dem Personal der Kindertagesstätten und der Schulen eine zweimal
                wöchentliche Testung angeboten. Diese ist unabhängig von der kommunalen Teststation
                auch bei Apotheken und Ärzten möglich.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                In einem zweiten Schritt sollen die Testangebote nun über eine kommunale Teststruktur für
                weitere Personen zugänglich gemacht werden. Das kommunale Testangebot gibt
                &nbsp;<strong>bestimmten Personengruppen</strong>&nbsp; die Möglichkeit, sich im Rahmen der Testverordnung testen
                zu lassen, auch wenn keine Symptome oder ein Verdachtsfall vorliegen. Die Testgruppe
                2 umfasst folgende Personen:
            </Typography>
            <ul>
                <li>in Kontakt mit vulnerablen Personengruppen stehende Personen (z.B. pflegende
                Angehörige, Haushaltsangehörige von Schwangeren, Angehörige von Personen,
                bei denen ein erhöhtes Risiko für einen schweren oder tödlichen Verlauf nach
                einer Infektion mit dem Coronavirus SARS-Cov-2 besteht)</li>
                <li>Personen, die ein hohes Expositionsrisiko im beruflichen oder privaten Umfeld
                hatten oder haben (z.B. mit Kindern, Jugendlichen und Familien im Rahmen der
                Hilfen zu Erziehung und in der Kinder- und Jugendarbeit Beschäftigte, Personen im
                öffentlichen Dienst wie Polizeibeamte, Gerichtsvollzieher, Beschäftigte in der Justiz
                und in Justizvollzugsanstalten, Beschäftigte im öffentlichen Verkehr, Beschäftigte
                in Flüchtlingsunterkünften, Mitglieder der Freiwilligen Feuerwehr, Ehrenamtliche
                der Rettungsfamilie)</li>
                <li>Schülerinnen und Schüler ab 14 Jahren sowie deren Eltern</li>
                <li>Beschäftigte in der Jugendhilfe</li>
                <li>Wahlhelfende</li>
            </ul>
            <Typography variant="body1" paragraph={true}>
                Dies bedeutet, dass Sie ab Montag, 08.03.2021 bis mindestens 31.03.2021, die Möglichkeit
                haben, sich zweimal in jeder Woche anlasslos und kostenlos in der kommunalen Schnellteststation
                in der DRK-Geschäftsstelle, Loretorstraße 12, 88069 Tettnang testen zu lassen. Eine Registrierung
                ist immer <strong>bis zum Tag davor</strong> möglich. Eine Ausnahme bildet der 7. März, hier ist
                eine <strong>Registrierung bis 15 Uhr</strong> möglich.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Wir appellieren an die Fairness aller, unsere Testkapazitäten sind begrenzt. Weitere Informationen erhalten
                Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}