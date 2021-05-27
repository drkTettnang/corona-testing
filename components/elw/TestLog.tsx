import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import Image from 'next/image';
import { Booking, Location } from '@prisma/client';
import dayjs from 'dayjs';
import WarningIcon from '@material-ui/icons/WarningOutlined';
import { grey } from '@material-ui/core/colors';
import sha1 from 'sha1';
import Barcode from 'react-barcode';
import Config from '../../lib/Config';
import { generatePublicId } from '../../lib/helper';
import TestLogBody from '../../templates/TestLogBody';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        page: {
            height: '100vh',
            position: 'relative',
        },
        header: {
            alignItems: 'flex-start'
        },
        ID: {
            border: '5px solid #000',
            fontWeight: 'bold',
            padding: theme.spacing(0, 1),
            fontSize: '1.5rem',
        },
        footer: {
            width: '100%',
            pageBreakAfter: 'always',
            position: 'absolute',
            bottom: 0,
        },
        signature: {
            minHeight: '1.8cm',
            position: 'relative',
        },
        signatureLabel: {
            borderTop: '1px dotted #000',
            fontSize: '0.8rem',
            marginTop: '1em',
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
        },
        user: {
            fontSize: '1rem',
            margin: theme.spacing(3),
            '& td': {
                padding: theme.spacing(0, 3),
                verticalAlign: 'top',
            }
        },
        icon: {
            verticalAlign: 'middle',
            color: grey[800],
            marginLeft: theme.spacing(1),
        },
        protocol: {
            border: '3px solid #000',
            borderSpacing: 0,
            width: '100%',
            '& td': {
                border: '1px solid #000',
                height: '1cm',
                padding: theme.spacing(1, 3),
                position: 'relative',
                textAlign: 'right',
            },
            '& tr:last-child td': {
                height: '2cm',
            },
            '& em': {
                position: 'absolute',
                top: 3,
                left: 3,
                fontSize: '0.6rem',
            },
            '& span': {
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 0,
                textAlign: 'center',
                fontSize: '0.6rem',
            }
        },
        result: {
            textAlign: 'center !important' as 'center',
            // width: 300,
            '& strong': {
                fontSize: '1.5rem',
            }
        },
        box: {
            border: '3px solid #000',
            position: 'relative',
            width: '6cm',
            height: '3cm',
            float: 'right',
            '& em': {
                position: 'absolute',
                top: 3,
                left: 3,
                fontSize: '0.6rem',
            }
        }
    }),
)

type Props = {
    location: Location
    booking: Booking
}

const TestLog: React.FC<Props> = ({ location, booking }) => {
    const classes = useStyles();
    const age = booking.birthday && dayjs().diff(booking.birthday, 'year');

    const groupId = sha1(booking.email).substr(-4);
    const locationMatch = location.address.match(/\d{5} ([^,;/]+)/);
    const city = locationMatch ? locationMatch[1] : undefined;

    return (<div className={classes.page}>
        <Box display="flex" className={classes.header}>
            {booking.id > 0 && <Barcode value={generatePublicId(booking.id)} format="CODE39" height={40} textAlign="left" fontSize={16} flat={true} font="Roboto, Helvetica, Arial, sans-serif" />}
            <Box flexGrow={1}></Box>
            <Image src={Config.LOGO_BW} alt={`Logo ${Config.VENDOR_NAME}`} height={40} width={200} loading="eager" unoptimized />
        </Box>

        <Typography variant="h4">Einverständniserklärung</Typography>
        <Typography variant="h6" gutterBottom={true}>zur Durchführung einer PoC-Antigen-Testung</Typography>

        {Config.CAR && <div className={classes.box}>
            <em>Bitte KFZ Kennzeichen notieren.</em>
        </div>}

        <table className={classes.user}>
            <tbody>
                <tr>
                    <td>Name:</td>
                    <td><strong>{booking.lastName}</strong>, {booking.firstName}</td>
                </tr>
                <tr>
                    <td>Geburtstag:</td>
                    <td>{booking.birthday && (new Date(booking.birthday)).toLocaleDateString('de-DE')}{age && age < 18 && <WarningIcon className={classes.icon} fontSize="small" />}</td>
                </tr>
                <tr>
                    <td>Anschrift:</td>
                    <td>{booking.street}<br />
                        {booking.postcode} {booking.city}
                    </td>
                </tr>
            </tbody>
        </table>

        <TestLogBody />

        <Grid container>
            <Grid item xs={5}>
                <div className={classes.signature}>
                    {city && booking.date && `${city}, ${(new Date(booking.date)).toLocaleDateString('de-DE', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                    <div className={classes.signatureLabel}>Ort, Datum</div>
                </div>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
                <div className={classes.signature}>
                    <div className={classes.signatureLabel}>Unterschrift der zu testenden Person bzw. Erziehungs-/Sorgeberechtigte</div>
                </div>
            </Grid>
        </Grid>

        <footer className={classes.footer}>
            <span style={{ float: 'right' }}>Termin: {booking.date && (new Date(booking.date)).toLocaleTimeString('de-DE', { minute: 'numeric', hour: 'numeric' })} Uhr ({groupId})</span>
            Nur vom DRK auszufüllen!
            <table className={classes.protocol}>
                <tbody>
                    <tr>
                        <td><em>Datum</em>{booking.date && (new Date(booking.date)).toLocaleDateString('de-DE', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                        <td colSpan={2}><em>Ort</em> {location.address}</td>
                    </tr>
                    <tr>
                        <td colSpan={3}><em>Verwendeter Test</em>{location.testKitName}</td>
                    </tr>
                    <tr>
                        <td><em>Uhrzeit Testbeginn</em></td>
                        <td><em>Testteam</em></td>
                        <td className={classes.result}>
                            <em>Ergebnis</em><strong>◯</strong> positiv - negativ <strong>◯</strong>
                            <span>ungültig = durchstreichen</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </footer>
    </div >);
}

export default TestLog;