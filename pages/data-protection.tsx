import React, { } from 'react';
import { Container, createStyles, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Image from 'next/image';
import Footer from '../components/layout/Footer';

const useStyles = makeStyles((theme) =>
    createStyles({
        header: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(14),
        },
        container: {
            '& h3': {
                marginTop: theme.spacing(6),
            },
            '& h4': {
                marginTop: theme.spacing(6),
            },
            '& h5': {
                marginTop: theme.spacing(6),
            }
        }
    }),
)

interface Props {

}

const DataProtectionPage: NextPage<Props> = ({ }) => {
    const classes = useStyles();

    return (
        <Container fixed className={classes.container}>
            <Grid container justify="flex-end" alignContent="flex-start" className={classes.header}>
                <a href="/"><Image src="/drk-logo-tettnang-lang.svg" alt="Logo - DRK Tettnang e.V." height={60} width="auto" /></a>
            </Grid>
            <Typography variant="h3" gutterBottom={true}>Datenschutzinformation</Typography>
            <Typography variant="body1" paragraph></Typography>

            <Typography variant="h4" gutterBottom={true}>1. Name und Anschrift des Verantwortlichen</Typography>
            <Typography variant="body1" paragraph>Der Verantwortliche im Sinne der Datenschutz-Grundverordnung und anderer nationaler
                Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist das:</Typography>

            <Typography variant="body1" paragraph>Deutsches Rotes Kreuz<br />
            Ortsverein Tettnang e.V.<br />
            derzeit vertreten durch den 1. Vorsitzenden Hubertus von Dewitz<br />
            Loretostraße 12<br />
            88069 Tettnang<br />
            <br />
            Telefon 07542 9332 0<br />
            geschaeftsstelle@drk-tettnang.de</Typography>

            <Typography variant="h4" gutterBottom={true}>2. Name und Anschrift des Datenschutzbeauftragten</Typography>
            <Typography variant="body1" paragraph>Unser Datenschutzverantwortlicher beim DRK Landesverband Baden-Württemberg erreichen Sie wie folgt:</Typography>

            <Typography variant="body1" paragraph>Deutsches Rotes Kreuz<br />
            Landesverband Baden-Württemberg<br />
            Badstraße 39-41<br />
            70372 Stuttgaart<br />
            datenschutz@drk-bw.de</Typography>

            <Typography variant="body1" paragraph>Inhaltliche Verantwortung: Klaus Herberth, Entwickler, klaus.herberth@drk-tettnang.de</Typography>

            <Typography variant="h4" gutterBottom={true}>3. Schnelltestung</Typography>
            <Typography variant="h5" gutterBottom={true}>3.1. Beschreibung und Umfang der Datenverarbeitung</Typography>
            <Typography variant="body1" paragraph>Wir erheben bei Ihrer Testung folgende Daten: Vor- und Zuname, postalische Anschrift, Telefonnummer, E-Mail, Geburtsdatum und Testergebnis.</Typography>

            <Typography variant="h5" gutterBottom={true}>3.2. Rechtsgrundlage</Typography>
            <Typography variant="body1" paragraph>Die Erhebung dieser Daten erfolgt auf Grundlage des Artikel 9 Absatz 2 DSGVO.</Typography>

            <Typography variant="h5" gutterBottom={true}>3.3. Zweck der Datenverarbeitung</Typography>
            <Typography variant="body1" paragraph>Sollten Sie positiv getestet werden, werden wir Sie kontaktieren, um Ihnen das Ergebnis mitzuteilen.
            Positive Befunde müssen gem. § 6 Absatz 1 Infektionsschutzgesetz namentlich an das zuständige Gesundheitsamt gemeldet werden. Bitte beachten
            Sie, dass für eine mögliche weitere Verarbeitung das Gesundheitsamt der datenschutzrechtlich Verantwortliche ist. Sollten Sie negativ
            getestet worden sein, findet keine Datenübermittlung statt.</Typography>

            <Typography variant="h5" gutterBottom={true}>3.4. Dauer der Speicherung</Typography>
            <Typography variant="body1" paragraph>Die Einverständniserklärung (Vor- und Zuname, postalische Anschrift, Telefonnummer, Geburtsdatum
            und Testergebnis) wird im Rahmen der gesetzlichen Aufbewahrungsfrist (derzeit 10 Jahre) aufbewahrt (§ 630f Abs. 3 BGB). Ihre E-Mail Adresse inkl. der digitalen Aufzeichnungen werden
                innerhalb von 14 Tagen nach der Testung gelöscht.</Typography>

            <Typography variant="h5" gutterBottom={true}>3.4. Welche Rechte haben Sie?</Typography>
            <Typography variant="body1" paragraph>Falls Sie mit der Verarbeitung Ihrer Daten nicht einverstanden sind, können Sie an der
            Testaktion nicht teilnehmen. Darüber hinaus haben Sie jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und
            Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung dieser Daten zu
            verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen
            Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</Typography>

            <Typography variant="body1" paragraph>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br />
            Königstraße 10a<br />
            70173 Stuttgart</Typography>

            <Typography variant="h4" gutterBottom={true}>4. Webseite</Typography>
            <Typography variant="body1" paragraph>Informationen zur Datenverarbeitung auf unserer Webseite erhalten Sie in
                unserer normalen <Link href="https://drk-tettnang.de/footer/datenschutz.html">Datenschutzerklärung</Link>.</Typography>

            <Footer />
        </Container>
    );
}

export default DataProtectionPage;