import React, { FormEvent, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Booking } from '@prisma/client';
import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@material-ui/core';
import Luhn from '../lib/luhn';
import { yellow, grey, red, green } from '@material-ui/core/colors';
import Axios from 'axios';
import Alert from '@material-ui/lab/Alert';

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
            '& label': {
                margin: theme.spacing(1, 0),
            }
        },
        button: {
            margin: theme.spacing(6, 1),
        }
    }),
)

type Props = {
    booking: Booking
    setBooking: (booking: Booking) => void
}

const ResultForm: React.FC<Props> = ({ booking, setBooking }) => {
    const classes = useStyles();
    const [result, setResult] = useState<string>(booking.result);
    const [isProcessing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const datePast = booking.date < new Date();

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
        }).then(() => {
            setBooking(undefined);
            setProcessing(false);
        }).catch(() => {
            setProcessing(false);
            setError('Ergebnis konnte nicht gespeichert werden.');
        });
    }

    const hasResult = booking.result !== 'unknown' && booking.result !== null;

    return (
        <Grid container spacing={3} justify="center">
            <Grid item md={6} xs={12}>
                <table className={classes.user}>
                    <tbody>
                        <tr>
                            <td>ID:</td>
                            <td>{Luhn.generate(booking.id + 100)}</td>
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

                <form onSubmit={onSubmit}>
                    <FormControl component="fieldset" className={classes.selection}>
                        <RadioGroup aria-label="gender" name="gender1" value={result} onChange={ev => setResult(ev.target.value)}>
                            <FormControlLabel value="negativ" control={<Radio required disabled={isProcessing || hasResult || !datePast} />} className={classes.negativ} label="Negativ" />
                            <FormControlLabel value="invalid" control={<Radio required disabled={isProcessing || hasResult || !datePast} />} className={classes.invalid} label="Ungültig" />
                            <FormControlLabel value="positiv" control={<Radio required disabled={isProcessing || hasResult || !datePast} />} className={classes.positiv} label="Positiv" />
                        </RadioGroup>
                    </FormControl>

                    <Button className={classes.button} type="submit" variant="contained" color="primary" disabled={isProcessing || hasResult || !datePast}>
                        {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Sende</> : 'Speichern & E-Mail versenden' }</Button>
                    <Button className={classes.button} variant="contained" onClick={() => setBooking(undefined)} disabled={isProcessing}>Zurück</Button>

                    {error && <Alert severity="error">{error}</Alert>}
                </form>
            </Grid>
        </Grid>
    )
}

export default ResultForm;