import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    cwa?: string
}

const TestLogBody: React.FC<Props> = ({ cwa }) => {
    const classes = useStyles();

    return (
        <>
            <Typography variant="body1">
                Ich erkläre mich durch Abgabe einer Probe (mittels Nasen-Rachenabstrich) damit einverstanden, dass
                diese auf das Vorhandensein von Sars-CoV-2 Viren getestet wird.
            </Typography>

            <ul>
                <li>Mir ist bewusst, dass sich durch die Testmethode leider keine absolute Sicherheit garantieren
                lässt und die Analysemethode unrichtige oder ungültige Testergebnisse hervorbringen kann. Ich werde daraus
                keinerlei Ansprüche gegenüber dem Betreiber der Teststelle ableiten.</li>

                <li>Mir ist bewusst, dass es bei oder nach dem Abstrich, zu Irritationen, Reizungen und in seltenen
                Fällen zu Blutungen an der Abstrichstelle kommen kann.</li>

                <li>Mir ist bewusst, dass ein positives Testergebnis bedeutet, dass ich mich unverzüglich in
                Absonderung begeben muss. Das gilt ebenfalls für Personen, die mit mir in einem Haushalt leben.
                (Siehe CoronaVO Absonderung)</li>

                <li>Ich weiß, dass ein positives Schnelltestergebnis durch einen anschließenden PCR-Test bestätigt
                werden sollte. Ich werde unverzüglich mit der zuständigen Corona-Anlaufstelle Kontakt
                aufnehmen, um einen Testtermin zu vereinbaren.</li>

                <li>Ich weiß, dass die Teilnahme an der Testungen freiwillig und kostenlos ist.</li>

                {cwa && <li>{cwa}</li>}
            </ul>

            <Typography variant="body1">
                Mit meiner Unterschrift erkläre ich mich mit der Durchführung des PoC-Antigen-Tests durch
                geschultes Personal, sowie dem Versand des Ergebnisses an die bei der Anmeldung genutzten E-Mail Adresse
                einverstanden. Die umseitig abgedruckten Hinweise zur Datenverarbeitung habe ich zur Kenntnis genommen.
            </Typography>
        </>
    )
}

export default TestLogBody;