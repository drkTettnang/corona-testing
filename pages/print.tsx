import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, createStyles, Grid, IconButton, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import axios from 'axios';
import { Alert } from '@material-ui/lab'
import { Booking, Slot, Location } from '@prisma/client';
import dayjs from 'dayjs';
import { generatePublicId, isValidPublicId, parsePublicId } from '../lib/helper';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Scanner from '../components/Scanner';
import DataProtectionPaper from '../components/DataProtectionPaper';
import TestLog from '../components/elw/TestLog';

type FullBooking = Booking & { slot: (Slot & { location: Location }) };

const REFRESH_SECONDS = 120;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: '100vh',
        },
        authCode: {
            width: 500,
            maxWidth: '100%',
        },
        hint: {
            marginTop: theme.spacing(3),
            color: theme.palette.text.hint,
        }
    }),
)

interface Props {

}

const Print: NextPage<Props> = () => {
    const classes = useStyles();
    const [error, setError] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [lastId, setLastId] = useState('');
    const [isAuthCodeValid, setAuthCodeValid] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [bookings, setBookings] = useState<FullBooking[]>([]);
    const [scanning, setScanning] = useState(false);

    const onAfterPrint = () => {
        let maxId = -1;

        for (const booking of bookings) {
            if (booking.id > maxId) {
                maxId = booking.id;
            }
        }

        if (maxId > 0) {
            const publicId = generatePublicId(maxId);

            setLastId(publicId);
            sessionStorage.setItem('lastId', publicId);
        }
    }

    useEffect(() => {
        window.addEventListener('afterprint', onAfterPrint);

        if (bookings.length > 0) {
            window.print();
        }

        return () => {
            window.removeEventListener('afterprint', onAfterPrint);
        }
    }, [bookings]);

    useEffect(() => {
        const storedAuthCode = sessionStorage.getItem('authCode');
        const storedLastId = sessionStorage.getItem('lastId');

        if (storedAuthCode && storedLastId && /^\d+$/.test(storedLastId)) {
            setLastId(storedLastId);
            setAuthCode(storedAuthCode);
        } else {
            sessionStorage.removeItem('authCode');
            sessionStorage.removeItem('lastId');
        }
    }, []);

    useEffect(() => {
        setError('');

        if (isAuthCodeValid || !authCode || !isValidPublicId(lastId)) {
            return;
        }

        const authCodeParts = authCode.split(':');

        if (authCodeParts[1] && authCodeParts[1].length === 40) {
            setProcessing(true);
            setScanning(false);

            axios.post('/api/station', {
                code: authCode,
                lastId: parsePublicId(lastId),
            }).then(response => {
                const isValid = response.data.result === 'valid';

                setAuthCodeValid(isValid);

                if (!isValid) {
                    setError('Der Code ist nicht korrekt');

                    sessionStorage.removeItem('authCode');
                    sessionStorage.removeItem('lastId');
                } else {
                    sessionStorage.setItem('authCode', authCode);
                    sessionStorage.setItem('lastId', lastId);
                }
            }).catch(response => {
                setError(`Der Code konnte nicht überprüft werden (${response.data?.result || 'unknown'})`);
            }).then(() => {
                setProcessing(false);
            });
        }
    }, [authCode, lastId]);

    useEffect(() => {
        if (!isAuthCodeValid) {
            return;
        }

        let interval: number;

        const checkBookings = () => {
            axios.get<FullBooking[]>('/api/search', {
                params: {
                    lastId: parsePublicId(lastId),
                },
                auth: {
                    username: dayjs().format('YYYY-MM-DD'),
                    password: authCode,
                }
            }).then((response) => {
                interval && response.data.length > 0 && window.clearInterval(interval);

                setBookings(response.data);
            }).catch(() => {
                setError('Es konnte nicht nach Buchungen gesucht werden. Vermutlich ist die Buchungsnummer ungültig. Bitte abmelden und neu versuchen.');
            });
        };

        checkBookings();

        interval = window.setInterval(checkBookings, REFRESH_SECONDS * 1000);

        return () => {
            window.clearInterval(interval);
        }
    }, [isAuthCodeValid, lastId]);

    const signOut = () => {
        sessionStorage.removeItem('authCode');
        sessionStorage.removeItem('lastId');
        setProcessing(false);
        setBookings([]);
        setAuthCodeValid(false);
        setAuthCode('');
        setLastId('');
    }

    const onAuthCodeScan = () => {
        if (!scanning) {
            setAuthCode('');
            setError('');
        }

        setScanning(!scanning);
    }

    const isLastIdValid = isValidPublicId(lastId);

    if (!isAuthCodeValid) {
        return (
            <Container fixed>
                <Grid container justify="center" alignItems="center" direction="column" className={classes.container}>
                    <TextField
                        required
                        type="number"
                        className={classes.authCode}
                        label="Letzte gebuchte und gedruckte ID"
                        value={lastId}
                        onChange={ev => setLastId(ev.target.value)}
                        error={!isLastIdValid}
                        variant="outlined"
                        disabled={isProcessing}
                        margin="normal" />
                    <TextField
                        required
                        className={classes.authCode}
                        label="Anmelde-Code"
                        value={authCode}
                        onChange={ev => setAuthCode(ev.target.value)}
                        variant="outlined"
                        disabled={isProcessing || !isLastIdValid}
                        margin="normal" />
                    <IconButton onClick={() => onAuthCodeScan()} disabled={isProcessing || !isLastIdValid}><PhotoCameraIcon /></IconButton>
                    {scanning && <Scanner onText={text => {
                        if (text.length === 40) {
                            setAuthCode(text);
                        }
                    }} />}

                    <Box m={3}>
                        {isProcessing && <CircularProgress />}
                        {error && !isProcessing && <Alert severity="error">{error}</Alert>}
                    </Box>
                </Grid>
            </Container>
        )
    }

    return (
        <>
            {bookings.length === 0 && <Box display="flex" flexDirection="column" style={{height: '100vh'}} alignItems="center" justifyContent="center">
                <Box m={3}>
                    <Button onClick={() => signOut()} size="small" variant="outlined" disabled={isProcessing}>Abmelden</Button>
                </Box>
                <Box flexGrow={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress />
                    <Typography className={classes.hint}>Warte auf neue Anmeldungen...</Typography>
                    {error && <Box m={3}><Alert severity="error">{error}</Alert></Box>}
                </Box>
            </Box>}
            {bookings.map(booking => <div key={booking.id}>
                <TestLog location={booking.slot.location} booking={booking} />
                <DataProtectionPaper />
            </div>)}
        </>
    )
}

export default Print;