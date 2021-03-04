import { Link, Typography } from '@material-ui/core';
import React from 'react';
import Config from '../../lib/Config';

export default function WelcomeText() {
    return (
        <>
            <Typography variant="h3" gutterBottom={true}>Corona-Testung</Typography>

            <Typography variant="body1" paragraph={true}>
                Am 23. Dezember 2020 bieten wir am Manzenberg (Schulzentrum) eine kostenlose Corona-Antigen-Schnelltestung an.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Wir wollen mit dieser Aktion Risikogruppen schützen und Angehörigen von pflegebedürftigen oder chronisch
                kranken Menschen in den Stunden unmittelbar nach dem Test einen Weihnachtsbesuch bei Ihren Lieben ermöglichen.
                Leider können wir durch die Schnelltestmethode <strong>keinen 100% Schutz</strong> vor Ansteckung mit dem
                Coronavirus gewährleisten. Das Risiko wird lediglich reduziert. Deshalb darf unter keinen Umständen auf
                die inzwischen etablierten Abstands- und Hygieneregeln verzichtet werden. Halten Sie sich bitte weiterhin an
                die AHA-Formel (Abstand halten, Hygieneregeln beachten, Alltagsmaske tragen).
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Wir gehen davon aus, dass wenn Sie sich zur Testung anmelden auch wissen, dass Sie unter Umständen zu den
                Personen gehören, die symptomlos infiziert sind und damit das Virus weitertragen, ohne dass Sie davon wissen.
                In diesen Fällen hoffen wir, für Klarheit sorgen zu können und helfen damit das unkontrollierte Weiterverbreiten
                des Corona-Virus zu reduzieren. In einigen Fällen ist ein positives Ergebnis falsch positiv, deshalb ist eine
                anschließende PCR-Testung notwendig.
            </Typography>
            <Typography variant="body1" paragraph={true}>
                Wir appellieren an die Fairness aller, unsere Testkapazitäten sind begrenzt. Weitere Informationen erhalten
                Sie auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
            </Typography>
        </>
    );
}