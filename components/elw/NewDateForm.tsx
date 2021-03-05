import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, TextField } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayJSUtils from '@date-io/dayjs';
import axios from 'axios';
import { mutate } from 'swr';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fieldset: {
            '& >*': {
                margin: theme.spacing(1),
                minWidth: 130,
            }
        },
    }),
)

type Props = {

}

const NewDateForm: React.FC<Props> = () => {
    const classes = useStyles();
    const [isProcessing, setProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [seats, setSeats] = useState(1);
    const [count, setCount] = useState(1);
    const [gap, setGap] = useState(15);

    const submitForm = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (isProcessing) {
            return;
        }

        setError('');
        setProcessing(true);

        axios.post('/api/bookings', {
            date: selectedDate,
            seats,
            count,
            gap,
        }).then(async () => {
            console.log('success');

            await mutate('/api/dates');

            setProcessing(false);
        }).catch((err) => {
            if (err.response.data?.result === 'failed') {
                setError('Leider konnten keine Termine angelegt werden. Vermutlich existieren sie schon.');
            } else {
                setError(`Es konnten keine Termine angelegt werden. (${err.response.data?.result})`);
            }

            setProcessing(false);
        });
    }

    return (
        <MuiPickersUtilsProvider utils={DayJSUtils}>
            <form onSubmit={submitForm} autoComplete="off">
                <Box margin={3} className={classes.fieldset}>
                    <DateTimePicker
                        label="Datum / Uhrzeit"
                        inputVariant="outlined"
                        margin="normal"
                        required
                        size="small"
                        disabled={isProcessing}
                        value={selectedDate}
                        onChange={date => setSelectedDate(date.toDate())}
                        disablePast={true}
                        minutesStep={5}
                    />

                    <TextField
                        required
                        label="Plätze"
                        type="number"
                        variant="outlined"
                        margin="normal"
                        value={seats}
                        onChange={ev => setSeats(parseInt(ev.target.value, 10))}
                        size="small"
                        disabled={isProcessing}
                        InputProps={{
                            inputProps: {
                                min: 1,
                                max: 100
                            }
                        }} />

                    <TextField
                        required
                        label="Wiederholungen"
                        type="number"
                        variant="outlined"
                        margin="normal"
                        value={count}
                        onChange={ev => setCount(parseInt(ev.target.value, 10))}
                        size="small"
                        disabled={isProcessing}
                        InputProps={{
                            inputProps: {
                                min: 1,
                                max: 160
                            }
                        }} />

                    <TextField
                        required
                        label="Abstand"
                        type="number"
                        variant="outlined"
                        margin="normal"
                        value={gap}
                        onChange={ev => setGap(parseInt(ev.target.value, 10))}
                        size="small"
                        disabled={isProcessing}
                        InputProps={{
                            inputProps: {
                                min: 5,
                                max: 60,
                            }
                        }} />

                    <Button type="submit" color="primary" variant="contained" disabled={isProcessing}>
                        {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Lege an</> : 'Anlegen'}
                    </Button>
                    {error && <Alert severity="warning">{error}</Alert>}
                </Box>
            </form>
        </MuiPickersUtilsProvider>
    )
}

export default NewDateForm;