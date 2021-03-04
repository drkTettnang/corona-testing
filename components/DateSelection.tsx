import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { useDates } from '../lib/swr';
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import Alert from '@material-ui/lab/Alert';
import { RESERVATION_DURATION } from '../lib/const';
import Config from '../lib/Config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: '160px',
        }
    }),
)

type Props = {

}

const DateSelection: React.FC<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
    const { dates, isLoading, isError } = useDates();
    const [error, setError] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>();
    const [isReserving, setIsReserving] = useState<boolean>(false);
    const [numberOfAdults, setNumberOfAdults] = useState<number>(0);
    const [numberOfChildren, setNumberOfChildren] = useState<number>(0);

    if (isError) {
        return <p>Termine konnten leider nicht geladen werden. Versuchen Sie es später bitte nochmals.</p>;
    }

    const reserve = () => {
        setIsReserving(true);

        Axios.put('/api/reserve', {
            date: selectedDate,
            numberOfAdults,
            numberOfChildren,
        }).then(async data => {
            console.log('success', data);

            await mutate('/api/dates');
            await mutate('/api/reservations');

            router.push('/application');
        }).catch(err => {
            setError(`Es ist ein Fehler aufgetreten. (${err.response.data?.result})`);
        });
    }

    const availableDates = (!isLoading && dates && Object.keys(dates).length > 0) ?
     Object.values<number>(dates).reduce((sum, i) => (sum + i), 0)
     :
     -1;

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <Typography variant="body1">Sie können einen Termin für bis zu {Config.MAX_ADULTS} Erwachsenen und {Config.MAX_CHILDREN} ihrer Kinder (unter 18 Jahren)
                        vereinbaren. Beachten Sie, dass Kinder nur in Begleitung eines Erziehungsberichtigten getestet werden können.</Typography>

                    <Box mt={3} mb={3}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="number-adults-label">Anzahl Erwachsener</InputLabel>
                            <Select
                                labelId="number-adults-label"
                                id="number-adults-label"
                                value={numberOfAdults}
                                onChange={ev => setNumberOfAdults(parseInt(ev.target.value as string, 10))}
                            >
                                {Array.from({length: Config.MAX_ADULTS + 1}, (_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="number-children-label">Anzahl Minderjähriger</InputLabel>
                            <Select
                                labelId="number-children-label"
                                id="number-children-label"
                                value={numberOfChildren}
                                disabled={numberOfAdults === 0}
                                onChange={ev => setNumberOfChildren(parseInt(ev.target.value as string, 10))}
                            >
                                {Array.from({length: Config.MAX_CHILDREN + 1}, (_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>

                    {numberOfAdults > 0 && (
                        !selectedDate ?
                            <Typography variant="body1">Bitte wählen Sie eine Uhrzeit aus.</Typography>
                            :
                            <>
                                <Typography variant="body1">Sie haben den Termin am <strong>{(new Date(selectedDate)).toLocaleString()}</strong> ausgewählt.</Typography>
                                <Box m={2}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => reserve()}
                                        disabled={isReserving}
                                    >{isReserving ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Reserviere Termin</> : 'Zur Anmeldung'}</Button>
                                </Box>
                                <Typography variant="body2">Bitte füllen Sie die Anmeldung innerhalb von {RESERVATION_DURATION} Minuten aus, ansonsten kann dieser Termin anderen Personen zur Verfügung stehen.</Typography>

                                <Box m={3}>
                                    {error && <Alert severity="error">{error}</Alert>}
                                </Box>
                            </>
                    )}

                    {availableDates === 0 && <Alert severity="info"><strong>Alle Plätze reserviert!</strong> Bitte nehmen Sie von einem Erscheinen ohne
                    Anmeldung Abstand, da wir nur über begrenzte Ressourcen verfügen und daher nur Personen mit Terminreservierung testen können.</Alert>}
                </Grid>
                <Grid item md={6} xs={12}>
                    {isLoading ?
                        <CircularProgress />
                        :
                        Object.keys(dates).sort().map(dateString => {
                            const numberOfDates = dates[dateString];
                            const date = new Date(dateString);

                            return (
                                <Button
                                    key={dateString}
                                    color="primary"
                                    variant={selectedDate === dateString ? 'contained' : 'outlined'}
                                    className={classes.button}
                                    onClick={() => setSelectedDate(dateString)}
                                    disabled={isReserving || numberOfDates < (numberOfAdults + numberOfChildren) || numberOfAdults === 0}>
                                    {date.toLocaleTimeString().replace(/(\d+:\d+):00/, '$1')} ({numberOfDates})
                                </Button>);
                        })}
                </Grid>
            </Grid>
        </div>
    )
}

export default DateSelection;