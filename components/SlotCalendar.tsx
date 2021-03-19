import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { Location } from '@prisma/client';
import { SlotInfo, Slots, useBookings, useSlots } from '../lib/swr';
import dayjs from 'dayjs';
import AvailabilityIcon from './AvailabilityIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import LockIcon from '@material-ui/icons/Lock';
import { getNumberOfRemainingDates } from '../lib/helper';
import 'dayjs/locale/de';
import { Alert } from '@material-ui/lab';

dayjs.locale('de');

function groupByDay(dates: Slots, excludedDays: string[] = []) {
    const groupedByDay: { [day: string]: { stats: { seats: number, occupied: number }, dates: Slots } } = {};

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
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        daySelected: {
            fontWeight: theme.typography.fontWeightBold,
        },
    }),
)

type Props = {
    selectedSlot: SlotInfo
    setSelectedSlot: (slot: SlotInfo) => void
    location: Location
    numberOfAdults: number
    numberOfChildren: number
    isReserving: boolean
}

const SlotCalendar: React.FC<Props> = ({ selectedSlot, setSelectedSlot, location, numberOfAdults, numberOfChildren, isReserving }) => {
    const classes = useStyles();
    const { dates, isLoading, isError } = useSlots(location.id);
    const { data: bookings, isLoading: bookingsAreLoading } = useBookings();
    const [expanded, setExpanded] = useState('');

    if (isError) {
        return <p>Termine konnten leider nicht geladen werden. Versuchen Sie es später bitte nochmals.</p>;
    }

    const bookedDays = bookings.map(booking => dayjs(booking.date).format('YYYY-MM-DD'));

    const groupedDates = isLoading ? undefined : groupByDay(dates);

    return (
        <>
            {!isLoading && Object.keys(groupedDates).length === 0 && <Alert severity="info">Für diesen Standort sind momentan keine Termine verfügbar.</Alert>}

            {isLoading || bookingsAreLoading ?
                <CircularProgress />
                :
                Object.keys(groupedDates).sort().map(key => {
                    const stats = groupedDates[key].stats;
                    const dates = groupedDates[key].dates;
                    const num = getNumberOfRemainingDates(bookings, dayjs(key, 'YYYY-MM-DD').toDate());
                    console.log('num', num)
                    const limitReached = num === 0;
                    const booked = bookedDays.includes(key);

                    let details: JSX.Element;

                    if (booked) {
                        details = <Typography variant="body2"><em>Pro Tag ist nur ein Termin möglich.</em></Typography>;
                    } else if (limitReached) {
                        details = <Typography variant="body2"><em>An diesem Tag können Sie keinen Termin buchen, da Sie die maximale Anzahl an Tests pro Woche erreicht haben.</em></Typography>;
                    } else {
                        details = <Box>
                            {Object.keys(dates).sort().map(dateString => {
                                const slot = dates[dateString];
                                const numberOfDates = slot.seats - slot.occupied;
                                const date = new Date(dateString);
                                const requireCode = slot.requireCode;

                                return (
                                    <Button
                                        key={dateString}
                                        color="primary"
                                        variant={selectedSlot?.id === slot.id ? 'contained' : 'outlined'}
                                        className={classes.button}
                                        onClick={() => setSelectedSlot(slot)}
                                        disabled={isReserving || numberOfDates < (numberOfAdults + numberOfChildren) || (numberOfAdults + numberOfChildren) === 0}>
                                        {requireCode && <LockIcon style={{ marginRight: 5, fontSize: 16 }} />}{date.toLocaleTimeString().replace(/(\d+:\d+):00/, '$1')} ({numberOfDates})
                                    </Button>);
                            })}
                        </Box>;
                    }

                    return (
                        <Accordion key={key} expanded={expanded === key} onChange={(ev, isExpanded) => setExpanded(isExpanded ? key : '')}>
                            {console.log(key, selectedSlot, dayjs(selectedSlot?.date).format('YYYY-MM-DD'))}
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography className={classes.heading}>
                                    <AvailabilityIcon occupied={stats.occupied} seats={stats.seats} disabled={booked || limitReached} />&nbsp;
                                            <span className={classNames({ [classes.daySelected]: selectedSlot && key === dayjs(selectedSlot?.date).format('YYYY-MM-DD') })}>{dayjs(key, 'YYYY-MM-DD').format('dddd, D. MMMM')}</span>&nbsp;
                                            <em>({stats.occupied}/{stats.seats})</em>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {details}
                            </AccordionDetails>
                        </Accordion>
                    );

                })}
        </>
    )
}

export default SlotCalendar;