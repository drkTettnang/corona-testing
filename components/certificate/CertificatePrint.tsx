import React from 'react';
import { Box, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import Image from 'next/image';
import { Booking } from '@prisma/client';
import A4Page from '../../components/layout/A4Page';
import Config from '../../lib/Config';
import QRCode from 'qrcode.react';
import Head from 'next/head';
import CertificateBody from './CertificateBody';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            position: 'relative',
        },
        header: {
            alignItems: 'flex-start',
            marginBottom: theme.spacing(3),
        },
        small: {
            fontSize: '0.7rem',
        },
        footer: {
            width: '100%',
            position: 'absolute',
            bottom: 0,
        },
    }),
)

type Props = {
    booking: Booking,
    url: string
}

const CertificatePrint: React.FC<Props> = ({ booking, url }) => {
    const classes = useStyles();

    return (
        <A4Page>
            <Head>
                <title>Bescheinigung SARS-CoV-2 Antigentests - {booking.firstName} {booking.lastName}</title>
                <meta name="robots" content="noindex,nofollow"></meta>
            </Head>
            <div className={classes.root}>
                <Box display="flex" className={classes.header}>
                    <Box flexGrow={1}></Box>
                    <Image src={Config.LOGO_BW} alt={`Logo ${Config.VENDOR_NAME}`} height={40} width={200} loading="eager" unoptimized />
                </Box>

                <CertificateBody booking={booking} />

                <Typography variant="body2" className={classes.small}>
                    <em>Hinweis: Diese Bescheinigung wurde mit Hilfe automatischer Einrichtungen
                        erlassen und ist daher auch ohne Unterschrift gültig.</em></Typography>
                <Typography variant="body2" gutterBottom={true} className={classes.small} color="textSecondary">
                    <em>(Please note: This document was issued electronically and is therefore valid without signature)</em></Typography>

                {Config.CERTIFICATE_VERIFICATION && <footer className={classes.footer}>
                    <Box display="flex" alignItems="flex-end" marginBottom={1}>
                        <Box flexGrow={1}>
                            <Typography variant="body2" className={classes.small}>
                                <em>Sie können diese Bescheinigung bis zu 14 Tage nach der Testung
                                    durch Scannung des QR-Codes verifizieren.</em></Typography>
                            <Typography variant="body2" className={classes.small} color="textSecondary">
                                <em>(This certificate can be verified by scanning the QR code until 14 days after the test was conducted)</em></Typography>
                        </Box>
                        <QRCode value={url} renderAs="svg" size={100} />
                    </Box>
                </footer>}
            </div>
        </A4Page>
    )
}

export default CertificatePrint;