import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Dates, useBookings, useDates } from '../lib/swr';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import Alert from '@material-ui/lab/Alert';
import { RESERVATION_DURATION } from '../lib/const';
import Config from '../lib/Config';
import { getNumberOfRemainingDates } from '../lib/helper';
import dayjs from 'dayjs';
import AvailabilityIcon from './AvailabilityIcon';
import classNames from 'classnames';

function groupByDay(dates: Dates, excludedDays: string[] = []) {
    const groupedByDay: { [day: string]: { stats: { seats: number, occupied: number }, dates: Dates } } = {};

    for (const dateString in dates) {
        const date = new Date(dateString);
        const key = dayjs(date).format('YYYY-MM-DD');

        if (excludedDays.includes(key)) {
            continue;
        }

        if (!groupedByDay[key]) {
            groupedByDay[key] = {
                stats: {
                    seats: 0,
                    occupied: 0,
                },
                dates: {}
            };
        }

        groupedByDay[key].stats.seats += dates[dateString].seats;
        groupedByDay[key].stats.occupied += dates[dateString].occupied;
        groupedByDay[key].dates[dateString] = dates[dateString];
    }

    return groupedByDay;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: '160px',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        daySelected: {
            fontWeight: theme.typography.fontWeightBold,
        }
    }),
)

type Props = {

}

const DateSelection: React.FC<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
    const { dates, isLoading, isError } = useDates();
    const { data: bookings, isLoading: bookingsAreLoading } = useBookings();
    const [error, setError] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>();
    const [isReserving, setIsReserving] = useState<boolean>(false);
    const [numberOfAdults, setNumberOfAdults] = useState<number>(0);
    const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
    const [expanded, setExpanded] = useState('');

    if (isError) {
        return <p>Termine konnten leider nicht geladen werden. Versuchen Sie es später bitte nochmals.</p>;
    }

    useEffect(() => {
        setSelectedDate('');
    }, [numberOfAdults, numberOfChildren]);

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

    const bookedDays = bookingsAreLoading || !bookings ? [] : bookings.map(booking => dayjs(booking.date).format('YYYY-MM-DD'));
    const groupedDates = isLoading ? undefined : groupByDay(dates);

    const availableDates = (groupedDates && Object.keys(groupedDates).length > 0) ?
        Object.values(groupedDates).reduce((sum, i) => (sum + (i.stats.seats - i.stats.occupied)), 0)
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
                                {Array.from({ length: Config.MAX_ADULTS + 1 }, (_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="number-children-label">Anzahl Minderjähriger</InputLabel>
                            <Select
                                labelId="number-children-label"
                                id="number-children-label"
                                value={numberOfChildren}
                                // disabled={numberOfAdults === 0}
                                onChange={ev => setNumberOfChildren(parseInt(ev.target.value as string, 10))}
                            >
                                {Array.from({ length: Config.MAX_CHILDREN + 1 }, (_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>

                    {(numberOfAdults + numberOfChildren) > Config.MAX_GROUP && <Alert severity="error">Es kann maximal ein Termin für {Config.MAX_GROUP} Person(en) erstellt werden.</Alert>}

                    {((numberOfAdults + numberOfChildren) > 0 && (numberOfAdults + numberOfChildren) <= Config.MAX_GROUP) && (
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
                    {isLoading || bookingsAreLoading ?
                        <CircularProgress />
                        :
                        Object.keys(groupedDates).sort().map(key => {
                            const stats = groupedDates[key].stats;
                            const dates = groupedDates[key].dates;
                            const limitReached = getNumberOfRemainingDates(bookings, dayjs(key, 'YYYY-MM-DD').toDate()) === 0;
                            const booked = bookedDays.includes(key);

                            let details: JSX.Element;

                            if (booked) {
                                details = <Typography variant="body2"><em>Pro Tag ist nur ein Termin möglich.</em></Typography>;
                            } else if (limitReached) {
                                details = <Typography variant="body2"><em>An diesem Tag können Sie keinen Termin buchen, da Sie die maximale Anzahl an Tests pro Woche erreicht haben.</em></Typography>;
                            } else {
                                details = <Box>
                                    {Object.keys(dates).sort().map(dateString => {
                                        const numberOfDates = dates[dateString].seats - dates[dateString].occupied;
                                        const date = new Date(dateString);

                                        return (
                                            <Button
                                                key={dateString}
                                                color="primary"
                                                variant={selectedDate === dateString ? 'contained' : 'outlined'}
                                                className={classes.button}
                                                onClick={() => setSelectedDate(dateString)}
                                                disabled={isReserving || numberOfDates < (numberOfAdults + numberOfChildren) || numberOfDates === 0}>
                                                {date.toLocaleTimeString().replace(/(\d+:\d+):00/, '$1')} ({numberOfDates})
                                            </Button>);
                                    })}
                                </Box>;
                            }

                            return (
                                <Accordion key={key} expanded={expanded === key} onChange={(ev, isExpanded) => setExpanded(isExpanded ? key : '')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography className={classes.heading}>
                                            <AvailabilityIcon occupied={stats.occupied} seats={stats.seats} disabled={booked || limitReached} />&nbsp;
                                            <span className={classNames({ [classes.daySelected]: key === dayjs(selectedDate).format('YYYY-MM-DD') })}>{dayjs(key, 'YYYY-MM-DD').format('dddd, D. MMMM')}</span>&nbsp;
                                            <em>({stats.occupied}/{stats.seats})</em>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {details}
                                    </AccordionDetails>
                                </Accordion>
                            );

                        })}
                </Grid>
            </Grid>
        </div>
    )
}

export default DateSelection;