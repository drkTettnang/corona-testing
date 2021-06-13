import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';
import Config from '../../lib/Config';
import { Booking } from '@prisma/client';
import CertificateSignature from '../../templates/CertificateSignature';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& h4': {
                fontSize: '1.4em',
                fontWeight: 'bold',
                marginBottom: theme.spacing(2),
            },
            '& h6': {
                fontSize: '1.2em',
                fontWeight: 'bold',
                marginBottom: theme.spacing(3),
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
        muted: {
            color: theme.palette.text.secondary,
            fontWeight: 100,
            fontStyle: 'italic',
            fontSize: '0.8em',
        },
        negativ: {
            borderBottom: '4px solid green',
        },
        positiv: {
            borderBottom: '4px solid red',
        }
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
    const resultsEn = {
        positiv: 'positive',
        negativ: 'negative',
    }

    return (
        <div className={classes.root}>
            <Typography variant="h4">Bescheinigung über das Vorliegen eines SARS-CoV-2 Antigentests<br />
                <span className={classes.muted}>(Certificate of a rapid antigen test result for detecting SARS-CoV-2 Virus)</span></Typography>

            <Typography variant="body1"><em>und zusätzlich bei positivem SARS-CoV-2 Antigentest:</em></Typography>
            <Typography variant="h6">Meldeformular nach § 8 Abs.1 Nr. 2, Nr. 5 und Nr. 7 IfSG verpflichtete Personen</Typography>

            <Box marginBottom={3}>
                <Typography variant="body1">
                    Es wird das Vorliegen eines <strong className={classes[booking.result]}>{results[booking.result]}</strong> Antigentests bescheinigt für:<br />
                    <span className={classes.muted}>(We certify a <strong className={classes[booking.result]}>{resultsEn[booking.result]}</strong> rapid antigen test result for)</span>
                </Typography>

                <table className={classes.user}>
                    <tbody>
                        <tr>
                            <td>Name, Vorname <span className={classes.muted}>(last name, first name)</span></td>
                            <td><strong>{booking.lastName}</strong>, {booking.firstName}</td>
                        </tr>
                        <tr>
                            <td>Geburtstag <span className={classes.muted}>(date of birth)</span></td>
                            <td>{(new Date(booking.birthday)).toLocaleDateString('de-DE')}</td>
                        </tr>
                        <tr>
                            <td>Telefon <span className={classes.muted}>(phone)</span></td>
                            <td>{booking.phone}</td>
                        </tr>
                        <tr>
                            <td>Anschrift <span className={classes.muted}>(address)</span></td>
                            <td>{booking.street}<br />
                                {booking.postcode} {booking.city}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Box>

            <Typography variant="h6">Der Antigentest wurde durchgeführt von{' '}
                <span className={classes.muted}>(The test was conducted by)</span></Typography>

            <table className={classes.user}>
                <tbody>
                    <tr>
                        <td>Name, Vorname:<br />
                            <span className={classes.muted}>(last name, first name)</span></td>
                        <td>{booking.personalA}</td>
                    </tr>
                    <tr>
                        <td>Ausführende Stelle:<br />
                            <span className={classes.muted}>(organisation)</span></td>
                        <td>{Config.VENDOR_ADDRESS.map((line, i) => <span key={i}>{line}<br /></span>)}</td>
                    </tr>
                    <tr>
                        <td>Verwendeter Antigentest:<br />
                            <span className={classes.muted}>(used antigen test)</span></td>
                        <td>{booking.testKitName}</td>
                    </tr>
                    <tr>
                        <td>Zeitpunkt:<br />
                            <span className={classes.muted}>(time of test)</span></td>
                        <td>{booking.evaluatedAt ? (new Date(booking.evaluatedAt)).toLocaleString('de-DE') : 'Unbekannt'}</td>
                    </tr>
                </tbody>
            </table>

            <CertificateSignature date={new Date(booking.evaluatedAt)} />
        </div>
    )
}

export default CertificateBody;