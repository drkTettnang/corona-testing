import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';
import Config from '../../lib/Config';
import booking from '../../pages/booking';
import { Booking } from '@prisma/client';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& h4': {
                fontSize: '1.4em',
                fontWeight: 'bold',
                marginBottom: theme.spacing(3),
            },
            '& h6': {
                fontSize: '1.2em',
                fontWeight: 'bold',
                marginBottom: theme.spacing(2),
            },
        },
        user: {
            fontSize: '1rem',
            margin: theme.spacing(3),
            '& td': {
                padding: theme.spacing(0, 3),
                verticalAlign: 'top',
            }
        },
    }),
)

type Props = {
    booking: Booking
}

const CertificateBody: React.FC<Props> = ({ booking }) => {
    const classes = useStyles();
    const results = {
        positiv: 'positiven',
        negativ: 'negativen',
    };

    return (
        <div className={classes.root}>
            <Typography variant="h4" gutterBottom={true}>Bescheinigung über das Vorliegen eines SARS-CoV-2 Antigentests</Typography>

            <Typography variant="body1"><em>und zusätzlich bei positivem SARS-CoV-2 Antigentest:</em></Typography>
            <Typography variant="h6" gutterBottom={true}>Meldeformular nach § 8 Abs.1 Nr. 2, Nr. 5 und Nr. 7 IfSG verpflichtete Personen</Typography>

            <Box marginTop={6} marginBottom={6}>
                <Typography variant="body1">
                    Es wird das Vorliegen eines <strong>{results[booking.result]}</strong> Antigentests bescheinigt für:
                </Typography>

                <table className={classes.user}>
                    <tbody>
                        <tr>
                            <td>Name, Vorname:</td>
                            <td><strong>{booking.lastName}</strong>, {booking.firstName}</td>
                        </tr>
                        <tr>
                            <td>Geburtstag:</td>
                            <td>{(new Date(booking.birthday)).toLocaleDateString('de-DE')}</td>
                        </tr>
                        <tr>
                            <td>Telefon:</td>
                            <td>{booking.phone}</td>
                        </tr>
                        <tr>
                            <td>Anschrift:</td>
                            <td>{booking.street}<br />
                                {booking.postcode} {booking.city}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Box>

            <Typography variant="h6" gutterBottom={true}>Der Antigentest wurde durchgeführt von</Typography>

            <table className={classes.user}>
                <tbody>
                    <tr>
                        <td>Name, Vorname:</td>
                        <td>{booking.personalA}</td>
                    </tr>
                    <tr>
                        <td>Ausführende Stelle:</td>
                        <td>{Config.VENDOR_ADDRESS.map(line => <>{line}<br /></>)}</td>
                    </tr>
                    <tr>
                        <td>Verwendeter Antigentest:</td>
                        <td>SARS-CoV-2 Rapid Antigen Test von Roche</td>
                    </tr>
                    <tr>
                        <td>Zeitpunkt:</td>
                        <td>{(new Date(booking.date)).toLocaleString('de-DE')}</td>
                    </tr>
                </tbody>
            </table>

            <Typography variant="body1">
                Tettnang, den {(new Date(booking.date)).toLocaleDateString('de-DE')}<br />
                gez. Geschäftsstelle DRK Ortsverein Tettnang</Typography>
        </div>
    )
}

export default CertificateBody;