import React, { FormEvent, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Booking, Slot, Location } from '@prisma/client';
import { Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@material-ui/core';
import { yellow, grey, red, green } from '@material-ui/core/colors';
import Axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import PrintIcon from '@material-ui/icons/Print';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { generatePublicId } from '../../lib/helper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
import DayJSUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        user: {
            fontSize: '1rem',
            margin: theme.spacing(3, 0),
            '& td': {
                padding: theme.spacing(1, 3, 1, 0),
                verticalAlign: 'top',
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
        selection: {
            width: '100%',
        },
        radiogroup: {
            '& label': {
                margin: theme.spacing(1, 0),
            }
        },
        button: {
            margin: theme.spacing(0, 1),
        }
    }),
)

type Props = {
    booking: Booking & { slot: (Slot & { location: Location }) }
    setBooking: (booking: (Booking & { slot: (Slot & { location: Location }) })) => void
}

const ResultForm: React.FC<Props> = ({ booking, setBooking }) => {
    const classes = useStyles();
    const [tester, setTester] = useState(booking.personalA || '');
    const [result, setResult] = useState<string>(booking.result);
    const [evaluatedAt, setEvaluatedAt] = useState(booking.evaluatedAt || booking.date);
    const [isProcessing, setProcessing] = useState(false);
    const [isCancelProcessing, setCancelProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isCancel, setCancel] = useState(false);

    const datePast = new Date(booking.date) < new Date();
    const isTesterValid = /^[\w äöü]+, [\w äöü]+$/i.test(tester);

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (isProcessing || !datePast) {
            return;
        }

        setProcessing(true);
        setError('');

        Axios.post('/api/result', {
            id: booking.id,
            result,
            tester,
            evaluatedAt,
        }).then(() => {
            setBooking(undefined);
            setProcessing(false);
        }).catch(() => {
            setProcessing(false);
            setError('Ergebnis konnte nicht gespeichert werden.');
        });
    }

    const onCancel = () => {
        setCancelProcessing(true);

        Axios.delete('/api/booking/' + booking.id).then(() => {
            setBooking(undefined);
            setProcessing(false);
        }).catch(() => {
            setCancelProcessing(false);
            setError('Buchung konnte nicht storniert werden.');
        });
    }

    const hasResult = booking.result !== 'unknown' && booking.result !== null;

    return (
        <Grid container spacing={3} justify="center">
            <Grid item md={6} xs={12}>
                <Grid container justify="flex-end" alignItems="center" spacing={1}>
                    {
                        isCancel
                            ?
                            <>
                                <Button startIcon={isCancelProcessing ? <CircularProgress size="1em" color="inherit" /> : <DeleteForeverIcon />} className={classes.button} color="primary" variant="contained" onClick={() => onCancel()} disabled={isProcessing || isCancelProcessing}>Stornieren &amp; E-Mail versenden</Button>
                                <Button startIcon={<CloseIcon />} className={classes.button} variant="contained" onClick={() => setCancel(false)} disabled={isProcessing || isCancelProcessing}>Abbrechen</Button>
                            </>
                            :
                            <Button variant="contained" onClick={() => setCancel(true)} disabled={isProcessing || hasResult || new Date(booking.date) < new Date()}>Stornieren?</Button>
                    }
                </Grid>

                <table className={classes.user}>
                    <tbody>
                        <tr>
                            <td>ID:</td>
                            <td>{generatePublicId(booking.id)}</td>
                        </tr>
                        <tr>
                            <td>Termin:</td>
                            <td>{(new Date(booking.date)).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Terminort:</td>
                            <td>{booking.slot.location.name}<br />
                                {booking.slot.location.address}</td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td><strong>{booking.lastName}</strong>, {booking.firstName}</td>
                        </tr>
                        <tr>
                            <td>Geburtstag:</td>
                            <td>{(new Date(booking.birthday)).toLocaleDateString('de-DE')}</td>
                        </tr>
                        <tr>
                            <td>Telefon:</td>
                            <td>{booking.phone || '-'}</td>
                        </tr>
                        <tr>
                            <td>Anschrift:</td>
                            <td>{booking.street}<br />
                                {booking.postcode} {booking.city}
                            </td>
                        </tr>
                        <tr>
                            <td>E-Mail:</td>
                            <td>{booking.email}</td>
                        </tr>
                    </tbody>
                </table>

                <MuiPickersUtilsProvider utils={DayJSUtils}>
                    <form onSubmit={onSubmit}>
                        <FormControl component="fieldset" className={classes.selection}>
                            <RadioGroup aria-label="gender" name="gender1" value={result} className={classes.radiogroup} onChange={ev => setResult(ev.target.value)}>
                                <FormControlLabel value="negativ" control={<Radio required disabled={isProcessing || hasResult || !datePast} />} className={classes.negativ} label="Negativ" />
                                <FormControlLabel value="invalid" control={<Radio required disabled={isProcessing || hasResult || !datePast} />} className={classes.invalid} label="Ungültig" />
                                <FormControlLabel value="positiv" control={<Radio required disabled={isProcessing || hasResult || !datePast} />} className={classes.positiv} label="Positiv" />
                            </RadioGroup>

                            {datePast && <TextField
                                required
                                label="Tester"
                                placeholder="Name, Vorname"
                                value={tester}
                                onChange={ev => setTester(ev.target.value)}
                                inputProps={{ pattern: '[\\w äöü]+, [\\w äöü]+' }}
                                helperText={!isTesterValid ? 'z.B.: Dunant, Henry' : undefined}
                                error={!isTesterValid}
                                disabled={isProcessing || hasResult || !datePast}
                                variant="outlined"
                                size="small"
                                margin="normal" />}
                        </FormControl>

                        <KeyboardDateTimePicker
                            inputVariant="outlined"
                            margin="normal"
                            size="small"
                            label="Zeitpunkt der Auswertung"
                            value={evaluatedAt}
                            onChange={date => setEvaluatedAt(date.toDate())}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            minDate={booking.date}
                            minDateMessage="Zeitpunkt kann nicht vor dem Termin liegen"
                            fullWidth
                            required
                            disabled={isProcessing || hasResult || !datePast}
                        />

                        <Box display="flex" marginTop={8} marginBottom={4}>
                            <Button startIcon={<ArrowBackIcon />} className={classes.button} variant="contained" onClick={() => setBooking(undefined)} disabled={isProcessing}>Zurück</Button>
                            <Box flexGrow={1}></Box>
                            <Button className={classes.button} type="submit" variant="contained" color="primary" disabled={isProcessing || hasResult || !datePast}>
                                {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Sende</> : 'Speichern & E-Mail versenden'}
                            </Button>
                            {hasResult && ['positiv', 'negativ'].includes(booking.result) && <Button startIcon={<PrintIcon />} className={classes.button} variant="contained" target="print" href={`/api/elw/certificate/${booking.id}.print`} aria-label="print" component="a">Drucken</Button>}
                        </Box>

                        {error && <Alert severity="error">{error}</Alert>}
                    </form>
                </MuiPickersUtilsProvider>
            </Grid>
        </Grid>
    )
}

export default ResultForm;