import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Container, createStyles, FormControlLabel, Grid, Hidden, IconButton, makeStyles, Switch, TextField, Theme, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Header from '../components/layout/Header';
import axios from 'axios';
import { Alert } from '@material-ui/lab'
import { Booking } from '@prisma/client';
import QRCode from 'qrcode.react';
import classnames from 'classnames';
import { green, grey, red } from '@material-ui/core/colors';
import dayjs from 'dayjs';
import Config from '../lib/Config';
import { generatePublicId, isValidPublicId, parsePublicId } from '../lib/helper';
import CloseIcon from '@material-ui/icons/Close';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Scanner from '../components/Scanner';
import { useLocations } from '../lib/swr';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        authCode: {
            width: 500,
            maxWidth: '100%',
        },
        user: {
            [theme.breakpoints.up('sm')]: {
                fontSize: '1.8rem',
            },
            margin: theme.spacing(3, 0),
            '& td': {
                padding: theme.spacing(1, 3, 1, 0),
                verticalAlign: 'top',
            }
        },
        selectionContainer: {
            [theme.breakpoints.only('xs')]: {
                flexDirection: 'column',
            },
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(6),
            },
        },
        selection: {
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(3),
            },
            backgroundColor: '#fff',
            padding: theme.spacing(1),
            border: '10px solid black',
            borderRadius: theme.spacing(1),
            textAlign: 'center',
            margin: '10px',
            cursor: 'pointer',
        },
        positive: {
            borderColor: red[500],
        },
        negative: {
            borderColor: green[500],
        },
        invalid: {
            borderColor: grey[500],
        },
        selected: {
            transform: 'scale(1.5)',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        },
        unselected: {
            opacity: 0.7,
        },
        disabled: {
            opacity: 0.3,
        }
    }),
)

const INVALID = 'INVALID';
const POSITIV = 'POSITIV';
const NEGATIV = 'NEGATIV';

interface Props {

}

const Station: NextPage<Props> = () => {
    const classes = useStyles();
    const { locations } = useLocations();
    const focusElement = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [tester, setTester] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [isAuthCodeValid, setAuthCodeValid] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [id, setId] = useState('');
    const [booking, setBooking] = useState<Booking>();
    const [selectedResult, setSelectedResult] = useState<'positiv' | 'negativ' | 'invalid' | 'unknown'>('unknown');
    const [webcam, setWebcam] = useState(false);
    const [scanning, setScanning] = useState(false);

    const isTesterValid = /^[\w äöü]+, [\w äöü]+$/i.test(tester);
    const locationId = isAuthCodeValid ? parseInt(authCode.split(':')[0], 10) : undefined;
    const location = typeof locationId === 'number' ? locations.filter(location => location.id === locationId)[0] : undefined;

    useEffect(() => {
        const storedAuthCode = sessionStorage.getItem('authCode');
        const storedTester = sessionStorage.getItem('tester');

        if (storedAuthCode && storedTester && /^\w+, \w+$/.test(storedTester)) {
            setTester(storedTester);
            setAuthCode(storedAuthCode);
        } else {
            sessionStorage.removeItem('authCode');
            sessionStorage.removeItem('tester');
        }
    }, []);

    useEffect(() => {
        let timeout: number;
        let buffer = '';

        const evaluateBuffer = () => {
            if (booking && [POSITIV, NEGATIV, INVALID].includes(buffer)) {
                onSelectResult(buffer.toLowerCase() as any);
            }

            buffer = '';
        };

        const handler = (ev: KeyboardEvent) => {
            if (timeout) {
                window.clearTimeout(timeout);
            }

            if (ev.target !== document.body) {
                return;
            }

            if (ev.key === 'Enter') {
                evaluateBuffer();
                return;
            }

            buffer += ev.key;

            timeout = window.setTimeout(evaluateBuffer, 400);
        }

        window.addEventListener('keypress', handler);

        return () => {
            window.removeEventListener('keypress', handler);
        }
    }, [booking, selectedResult, isProcessing]);

    useEffect(() => {
        const handler = (ev: KeyboardEvent) => {
            if (ev.target === document.body && id === '' && !booking) {
                focusElement.current?.focus();
            }
        };

        window.addEventListener('keydown', handler);

        return () => {
            window.removeEventListener('keydown', handler);
        }
    }, []);

    useEffect(() => {
        setError('');

        if (isAuthCodeValid || !authCode) {
            return;
        }

        const authCodeParts = authCode.split(':');

        if (authCodeParts[1] && authCodeParts[1].length === 40) {
            setProcessing(true);
            setScanning(false);

            axios.post('/api/station', { code: authCode }).then(response => {
                const isValid = response.data.result === 'valid';

                setAuthCodeValid(isValid);

                if (!isValid) {
                    setError('Der Code ist nicht korrekt');

                    sessionStorage.removeItem('authCode');
                    sessionStorage.removeItem('tester');
                } else {
                    sessionStorage.setItem('authCode', authCode);
                    sessionStorage.setItem('tester', tester);
                }
            }).catch(response => {
                setError(`Der Code konnte nicht überprüft werden (${response.data?.result || 'unknown'})`);
            }).then(() => {
                setProcessing(false);
            });
        }
    }, [authCode]);

    useEffect(() => {
        if (id === '') {
            return;
        }

        if (id.length < (Config.MIN_PUBLIC_ID.toString().length + 1)) {
            setError('');
        } else if (isValidPublicId(id)) {
            setError('');
            setProcessing(true);
            setScanning(false);

            axios.get<Booking[]>('/api/search', {
                params: {
                    id: parsePublicId(id)
                },
                auth: {
                    username: dayjs().format('YYYY-MM-DD'),
                    password: authCode,
                }
            }).then(response => {
                if (response.data.length === 0) {
                    setError('Keine Treffer');
                } else if (response.data.length !== 1) {
                    setError('Ups. Da stimmt was nicht.');
                } else if (response.data[0].result !== 'unknown') {
                    setError('Resultat wurde schon eingetragen: ' + response.data[0].result);
                } else {
                    setBooking(response.data[0]);
                }
            }).catch(response => {
                setError(`Fehler bei der Abfrage (${response.data})`);
            }).then(() => {
                setProcessing(false);
                setId('');
            });
        } else {
            setError('Nummer ist ungültig');
        }
    }, [id]);

    const onSelectResult = (result: 'positiv' | 'negativ' | 'invalid' | 'unknown') => {
        if (isProcessing) {
            return;
        }

        if (selectedResult === result) {
            console.log('Confirmed: ', selectedResult);

            if (selectedResult !== 'unknown') {
                setProcessing(true);

                axios.post('/api/result', {
                    id: booking.id,
                    result,
                    tester,
                }, {
                    auth: {
                        username: dayjs().format('YYYY-MM-DD'),
                        password: authCode,
                    }
                }).then(() => {
                    setBooking(undefined);
                    setProcessing(false);
                    setId('');
                }).catch(() => {
                    setProcessing(false);
                    setError('Ergebnis konnte nicht gespeichert werden.');
                }).then(() => {
                    setSelectedResult('unknown');
                });
            }
        } else {
            setSelectedResult(result);
        }
    }

    const signOut = () => {
        sessionStorage.removeItem('authCode');
        sessionStorage.removeItem('tester');
        setProcessing(false);
        setBooking(undefined);
        setSelectedResult('unknown');
        setId('');
        setAuthCodeValid(false);
        setAuthCode('');
        setTester('');
    }

    const closeBooking = () => {
        if (!isProcessing) {
            setBooking(undefined);
            setSelectedResult('unknown');
            setId('');
        }
    }

    const onAuthCodeScan = () => {
        if (!scanning) {
            setAuthCode('');
            setError('');
        }

        setScanning(!scanning);
    }

    return (
        <>
            <Container fixed>
                <Hidden only="xs">
                    <Header />
                </Hidden>

                {isAuthCodeValid &&
                    <Box marginBottom={3}>
                        {location && <Typography gutterBottom={true}>{location.name}: {location.address}</Typography>}

                        <Grid container justify="flex-end" alignItems="center" spacing={1}>
                            <Grid item>
                                <FormControlLabel
                                    control={<Switch checked={webcam} onChange={(ev) => setWebcam(ev.target.checked)} color="primary" />}
                                    label="Webcam"
                                />
                            </Grid>
                            <Box flexGrow={1}></Box>
                            <Grid item>Guten Tag, {tester.split(', ')[1]}</Grid>
                            <Grid item>
                                <Button onClick={() => signOut()} size="small" variant="outlined" disabled={isProcessing}>Abmelden</Button>
                            </Grid>
                        </Grid>
                    </Box>
                }

                <Grid container justify="center" alignItems="center" direction="column">
                    {!isAuthCodeValid ?
                        <>
                            <TextField
                                required
                                className={classes.authCode}
                                label="Tester"
                                placeholder="Name, Vorname"
                                value={tester}
                                onChange={ev => setTester(ev.target.value)}
                                inputProps={{ pattern: '[\w äöü]+, [\w äöü]+' }}
                                helperText={!isTesterValid ? 'z.B.: Dunant, Henry' : undefined}
                                error={!isTesterValid}
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
                                disabled={isProcessing || !isTesterValid}
                                margin="normal" />
                            <IconButton onClick={() => onAuthCodeScan()} disabled={isProcessing || !isTesterValid}><PhotoCameraIcon /></IconButton>
                            {scanning && <Scanner onText={text => {
                                if (text.length === 40) {
                                    setAuthCode(text);
                                }
                            }} />}
                        </>
                        :
                        !booking && (webcam ?
                            <>
                                <IconButton onClick={() => setScanning(!scanning)} disabled={isProcessing || !!booking}><PhotoCameraIcon /></IconButton>
                                {scanning && <Scanner onText={text => setId(text)} />}
                            </>
                            :
                            <TextField
                                autoFocus
                                required
                                inputRef={focusElement}
                                label="ID"
                                type="number"
                                name="id"
                                variant="outlined"
                                value={id}
                                onChange={ev => setId(ev.target.value)}
                                size="small"
                                disabled={isProcessing || !!booking}
                                InputProps={{
                                    inputProps: {
                                        min: 1000
                                    }
                                }} />
                        )
                    }

                    <Box m={3}>
                        {isProcessing && <CircularProgress />}
                        {error && !isProcessing && <Alert severity="error">{error}</Alert>}
                    </Box>

                    {booking && <Button startIcon={<CloseIcon />} variant="outlined" onClick={() => closeBooking()} disabled={isProcessing}>Schließen</Button>}

                    {booking &&
                        <Box m={3}>
                            <table className={classes.user}>
                                <tbody>
                                    <tr>
                                        <td>ID:</td>
                                        <td>{generatePublicId(booking.id)}</td>
                                    </tr>
                                    <tr>
                                        <td>Name:</td>
                                        <td><strong>{booking.lastName}</strong>, {booking.firstName}</td>
                                    </tr>
                                    <tr>
                                        <td>Geburtstag:</td>
                                        <td>{(new Date(booking.birthday)).toLocaleDateString('de-DE')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                    }
                </Grid>
            </Container>
            {booking &&
                <Container maxWidth={false}>
                    <Grid container justify="space-between" alignItems="center" className={classes.selectionContainer}>
                        <Grid item className={classnames(classes.selection, classes.positive, {
                            [classes.selected]: selectedResult === 'positiv',
                            [classes.unselected]: selectedResult !== 'positiv' && selectedResult !== 'unknown',
                            [classes.disabled]: isProcessing,
                        })} onClick={() => onSelectResult('positiv')}>
                            <Hidden only="xs">
                                <QRCode value={POSITIV} renderAs="svg" />
                            </Hidden>
                            <Typography>POSITIV</Typography>
                        </Grid>

                        <Grid item className={classnames(classes.selection, classes.invalid, {
                            [classes.selected]: selectedResult === 'invalid',
                            [classes.unselected]: selectedResult !== 'invalid' && selectedResult !== 'unknown',
                            [classes.disabled]: isProcessing,
                        })} onClick={() => onSelectResult('invalid')}>
                            <Hidden only="xs">
                                <QRCode value={INVALID} renderAs="svg" />
                            </Hidden>
                            <Typography>UNGÜLTIG</Typography>
                        </Grid>

                        <Grid item className={classnames(classes.selection, classes.negative, {
                            [classes.selected]: selectedResult === 'negativ',
                            [classes.unselected]: selectedResult !== 'negativ' && selectedResult !== 'unknown',
                            [classes.disabled]: isProcessing,
                        })} onClick={() => onSelectResult('negativ')}>
                            <Hidden only="xs">
                                <QRCode value={NEGATIV} renderAs="svg" />
                            </Hidden>
                            <Typography>NEGATIV</Typography>
                        </Grid>
                    </Grid>
                </Container>
            }
        </>
    )
}

export default Station;