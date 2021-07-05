import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Config from '../lib/Config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& h3': {
                counterReset: 'sectionCounter subSectionCounter',
            },
            '& h4:before': {
                content: 'counter(sectionCounter) ".\\0000a0\\0000a0"',
                counterIncrement: 'sectionCounter',
                counterReset: 'subSectionCounter',
            },
            '& h5:before': {
                content: 'counter(sectionCounter) "." counter(subSectionCounter) ".\\0000a0\\0000a0"',
                counterIncrement: 'subSectionCounter',
            }
        }
    }),
)

type Props = {

}

const DataProtectionBody: React.FC<Props> = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h3" gutterBottom={true}>Datenschutzinformation</Typography>
            <Typography variant="body1" paragraph></Typography>

            <Typography variant="h4" gutterBottom={true}>Name und Anschrift des Verantwortlichen</Typography>
            <Typography variant="body1" paragraph>Der Verantwortliche im Sinne der Datenschutz-Grundverordnung und anderer nationaler
                Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger datenschutzrechtlicher Bestimmungen ist das:</Typography>

            <Typography variant="body1" paragraph>{Config.VENDOR_ADDRESS.map((line, i) => <span key={i}>{line}<br /></span>)}
                {Config.CONTACT_MAIL}</Typography>

            <Typography variant="h4" gutterBottom={true}>Name und Anschrift des Datenschutzbeauftragten</Typography>
            <Typography variant="body1" paragraph>Unser Datenschutzverantwortlicher beim DRK Landesverband Baden-Württemberg erreichen Sie wie folgt:</Typography>

            <Typography variant="body1" paragraph>Deutsches Rotes Kreuz<br />
            Landesverband Baden-Württemberg<br />
            Badstraße 39-41<br />
            70372 Stuttgaart<br />
            datenschutz@drk-bw.de</Typography>

            <Typography variant="body1" paragraph>Inhaltliche Verantwortung: Klaus Herberth, Entwickler, corona-testung@drk-tettnang.de</Typography>

            <Typography variant="h4" gutterBottom={true}>Beschreibung und Umfang der Datenverarbeitung</Typography>
            <Typography variant="body1" paragraph>Wir erheben bei Ihrer Testung folgende Daten: Vor- und Zuname, postalische Anschrift,
            Telefonnummer, E-Mail, Geburtsdatum, Testergebnis, und ggf. das KFZ-Kennzeichen. Zusätzlich verarbeiten und speichern wir beim Besuch der
            Webseite Datum und Uhrzeit der Anfrage, IP-Adresse, sowie die URL.</Typography>

            <Typography variant="h4" gutterBottom={true}>Rechtsgrundlage</Typography>
            <Typography variant="body1" paragraph>Die Erhebung dieser Daten erfolgt auf Grundlage des Artikel 9 Absatz 2 DSGVO.</Typography>

            <Typography variant="h4" gutterBottom={true}>Zweck der Datenverarbeitung</Typography>
            <Typography variant="body1" paragraph>Um ihnen ihr Ergebnis mitzuteilen, werden wir ihnen das Resultat des Tests via E-Mail zusenden.
            Positive Befunde müssen gem. § 6 Absatz 1 Infektionsschutzgesetz namentlich an das zuständige Gesundheitsamt gemeldet werden. Bitte beachten
            Sie, dass für eine mögliche weitere Verarbeitung das Gesundheitsamt der datenschutzrechtlich Verantwortliche ist. Sollten Sie negativ
            getestet worden sein, findet keine Datenübermittlung statt.</Typography>

            <Typography variant="body1" paragraph>Um uns vor Angriffen zu schützen und ggf. eine Strafverfolgung zu ermöglichen bzw. Fehler zu analysieren,
            speichern wir die genannten technischen Daten für einen kurzen Zeitraum.</Typography>

            <Typography variant="h4" gutterBottom={true}>Dauer der Speicherung</Typography>
            <Typography variant="body1" paragraph>Die Einverständniserklärung (Vor- und Zuname, postalische Anschrift, Telefonnummer, Geburtsdatum, ggf. KFZ Kennzeichen
            und Testergebnis) wird im Rahmen der gesetzlichen Aufbewahrungsfrist (derzeit 10 Jahre) aufbewahrt (§ 630f Abs. 3 BGB). Ihre E-Mail Adresse inkl. der
            digitalen Aufzeichnungen werden innerhalb von {Config.RETENTION_DAYS} Tagen nach der Testung gelöscht. Dies gilt auch für alle anderen technischen Daten.</Typography>

            <Typography variant="h4" gutterBottom={true}>Welche Rechte haben Sie?</Typography>
            <Typography variant="body1" paragraph>Falls Sie mit der Verarbeitung Ihrer Daten nicht einverstanden sind, können Sie an der
            Testaktion nicht teilnehmen. Darüber hinaus haben Sie jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und
            Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung dieser Daten zu
            verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen
            Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</Typography>

            <Typography variant="body1" paragraph>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br />
            Königstraße 10a<br />
            70173 Stuttgart</Typography>

            {children}
        </div>
    )
}

export default DataProtectionBody;