import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Card, CardContent, CardHeader } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Axios from 'axios';
import { Booking, Slot, Location } from '@prisma/client';
import { yellow, red, green, grey } from '@material-ui/core/colors';
import { generatePublicId, isValidPublicId, parsePublicId } from '../../lib/helper';
import Config from '../../lib/Config';
import CustomCardHeader from '../CustomCardHeader';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fieldset: {
            display: 'inline-block',
            '& form>*': {
                margin: theme.spacing(1),
            }
        },
        header: {
            '& th': {
                fontWeight: 'bold',
            }
        },
        unknown: {
            backgroundColor: yellow[100],
        },
        invalid: {
            backgroundColor: grey[100],
        },
        positiv: {
            backgroundColor: red[100],
        },
        negativ: {
            backgroundColor: green[100],
        },
    }),
)

type Props = {
    setBooking: (booking: Booking & { slot: (Slot & { location: Location }) }) => void
}

const SearchForm: React.FC<Props> = ({ setBooking }) => {
    const classes = useStyles();
    const [id, setId] = useState<string>('');
    const [idError, setIdError] = useState<string>('');
    const [name, setName] = useState<{ first: string, last: string }>({ first: '', last: '' });
    const [isProcessing, setProcessing] = useState(false);
    const [searchMessage, setSearchMessage] = useState<{ message: string, severity: 'error' | 'warning' | 'info' | 'success' }>({ message: '', severity: 'info' });
    const [bookings, setBookings] = useState<(Booking & { slot: (Slot & { location: Location }) })[]>([]);

    const onIdChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setId(ev.target.value);

        if (ev.target.value.length < (Config.MIN_PUBLIC_ID.toString().length + 1) || isValidPublicId(ev.target.value)) {
            setIdError('');
        } else {
            setIdError('Nummer ist ungültig');
        }
    }

    const onNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setName({
            ...name,
            [ev.target.name]: ev.target.value,
        });
    };

    const onSubmitFactory = (field: 'id' | 'name') => {
        return (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();

            if (isProcessing || (field === 'id' && idError)) {
                return;
            }

            setProcessing(true);

            const params = field === 'id' ? { id: parsePublicId(id) } : { firstName: name.first, lastName: name.last };

            Axios.get('/api/search', {
                params,
            }).then(res => {
                if (res.data.length === 0) {
                    setBookings([]);

                    setSearchMessage({
                        message: 'Keine Treffer.',
                        severity: 'info',
                    });
                } else {
                    setSearchMessage({ message: '', severity: 'info' });

                    if (field === 'id' && res.data.length === 1 && params.id === res.data[0].id) {
                        setBooking(res.data[0]);
                        setBookings([]);
                    } else {
                        setBookings(res.data);
                    }
                }

                setProcessing(false);
            }).catch((err) => {
                console.log('search error', err, err.response.data);

                setSearchMessage({
                    message: 'Fehler beim Suchen.',
                    severity: 'warning',
                });

                setBookings([]);
                setProcessing(false);
            })
        }
    }

    return (
        <Card>
            <CustomCardHeader title="Suche"></CustomCardHeader>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} className={classes.fieldset}>
                        <form onSubmit={onSubmitFactory('id')} autoComplete="off">
                            <TextField
                                autoFocus
                                required
                                label="ID"
                                type="number"
                                name="id"
                                variant="outlined"
                                value={id}
                                onChange={onIdChange}
                                size="small"
                                disabled={isProcessing}
                                InputProps={{
                                    inputProps: {
                                        min: 1000
                                    }
                                }} />
                            <Button type="submit" color="primary" variant="contained" disabled={isProcessing}>
                                {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Suche</> : 'Suche ID'}
                            </Button>
                            {idError && <Alert severity="warning">{idError}</Alert>}
                        </form>
                    </Grid>

                    <Grid item xs={12} md={8} className={classes.fieldset}>
                        <form onSubmit={onSubmitFactory('name')} autoComplete="off">
                            <TextField required label="Vorname" name="first" variant="outlined" value={name.first} onChange={onNameChange} disabled={isProcessing} size="small" />
                            <TextField required label="Nachname" name="last" variant="outlined" value={name.last} onChange={onNameChange} disabled={isProcessing} size="small" />
                            <Button type="submit" color="primary" variant="contained" disabled={isProcessing}>
                                {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Suche</> : 'Suche Name'}
                            </Button>
                        </form>
                    </Grid>
                </Grid>


                {searchMessage.message && <Box mt={3} mb={3}><Alert severity={searchMessage.severity}>{searchMessage.message}</Alert></Box>}

                {bookings.length > 0 && <Box mt={3} mb={3}>
                    <TableContainer>
                        <Table>
                            <TableHead className={classes.header}>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Anschrift</TableCell>
                                    <TableCell>Geburtstag</TableCell>
                                    <TableCell>Termin</TableCell>
                                    <TableCell>Ort</TableCell>
                                    <TableCell>Testteam</TableCell>
                                    <TableCell>Ergebnis</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map(booking => {
                                    const result = {
                                        invalid: 'ungültig',
                                        unknown: 'unbekannt',
                                        positiv: 'positiv',
                                        negativ: 'negativ',
                                    };

                                    return <TableRow key={booking.id}>
                                        <TableCell>{generatePublicId(booking.id)}</TableCell>
                                        <TableCell>{booking.firstName} {booking.lastName}</TableCell>
                                        <TableCell>{booking.street}<br />{booking.postcode} {booking.city}</TableCell>
                                        <TableCell>{(new Date(booking.birthday)).toLocaleDateString()}</TableCell>
                                        <TableCell title={(new Date(booking.date)).toLocaleString()}>{(new Date(booking.date)).toLocaleString()}</TableCell>
                                        <TableCell>{booking.slot.location.name}</TableCell>
                                        <TableCell>{booking.personalA || '-'}</TableCell>
                                        <TableCell className={classes[booking.result || 'unknown']}>{result[booking.result || 'unknown']}</TableCell>
                                        <TableCell><Button variant="contained" onClick={() => setBooking(booking)}>Auswahl</Button></TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>}

            </CardContent>
        </Card>
    )
}

export default SearchForm;