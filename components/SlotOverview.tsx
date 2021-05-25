import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardHeader, CircularProgress, Typography } from '@material-ui/core';
import { useSlotOverview } from '../lib/swr';
import dayjs from 'dayjs';
import AvailabilityIcon from './AvailabilityIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LockIcon from '@material-ui/icons/Lock';
import 'dayjs/locale/de';
import { Alert } from '@material-ui/lab';
import Config from '../lib/Config';
import Shadows from '../theme/shadows';
import bookings from '../pages/api/bookings';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        muted: {
            fontSize: theme.typography.pxToRem(14),
            color: theme.palette.text.secondary,
        },
        button: {
            fontSize: theme.typography.pxToRem(15),
            display: 'inline-block',
            margin: theme.spacing(1),
            minWidth: 120,
        },
        pos: {
            marginBottom: theme.spacing(3),
        },
        card: {
            marginBottom: theme.spacing(5),
            boxShadow: (Shadows['light'][25] as any).z8,
        }
    }),
)

type Slot = { date: Date, protected: boolean, seats: number, bookings: number };

type Props = {

}

const SlotOverview: React.FC<Props> = () => {
    const classes = useStyles();
    const { isLoading, data } = useSlotOverview();
    const [expanded, setExpanded] = useState('');

    if (!isLoading && data.length === 0) {
        return <Alert severity="info">Aktuell sind keine Termine verfügbar.</Alert>;
    }

    const globalBookings = !isLoading ? data.reduce((global, location) => global + location.slots.reduce((count, slot) => count + slot.bookings, 0), 0) : 0;
    const globalSeats = !isLoading ? data.reduce((global, location) => global + location.slots.reduce((count, slot) => count + slot.seats, 0), 0) : 0;

    return (
        <>
            {(!isLoading && globalBookings >= globalSeats) && <Box mb={6}>
                <Alert severity="warning">
                    Aktuell sind wir leider ausgebucht. Bitte versuchen Sie es später erneut.
                </Alert>
            </Box>}

            <Box mb={6}>
                <Typography variant="h5" align="center">Terminvorschau</Typography>
                <Box ml={3} mr={3}>
                    <Typography align="center" color="textSecondary">
                        Wir bieten folgende Termine innerhalb der nächsten {Config.MAX_DAYS} Tage an. Um einen Termin zu reservieren, melden Sie sich bitte oben mit ihrer E-Mail Adresse an.</Typography>
                </Box>
            </Box>

            {isLoading ?
                <CircularProgress />
                :
                data.map(location => {
                    const slotsGroupedByDay = location.slots.reduce<Slot[][]>((groups, slot) => {
                        if (groups.length === 0) {
                            return [[slot]];
                        }

                        const currentDay = dayjs(groups[groups.length - 1][0].date).format('YYYY-MM-DD');

                        if (currentDay !== dayjs(slot.date).format('YYYY-MM-DD')) {
                            groups.push([]);
                        }

                        groups[groups.length - 1].push(slot);

                        return groups;
                    }, []);

                    return (
                        <Card key={location.id} className={classes.card}>
                            <CardContent>
                                <Typography variant="h6">
                                    {location.name} <span className={classes.muted}>
                                        {location.address}</span>
                                </Typography>
                                <Typography className={classes.pos} color="textSecondary">
                                    {location.description}
                                </Typography>

                                {slotsGroupedByDay.map(slots => {
                                    const seats = slots.reduce((count, slot) => count + slot.seats, 0);
                                    const bookings = slots.reduce((count, slot) => count + slot.bookings, 0);
                                    const key = location.id + '/' + dayjs(slots[0].date).format('YYYY-MM-DD');

                                    return (
                                        <Accordion key={key} expanded={expanded === key} onChange={(ev, isExpanded) => setExpanded(isExpanded ? key : '')}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <Typography className={classes.heading}>
                                                    <AvailabilityIcon occupied={bookings} seats={seats} disabled={false} />&nbsp;
                                        <span>{dayjs(slots[0].date).format('dddd, D. MMMM')}</span>&nbsp;
                                        <em>({bookings}/{seats})</em>
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box>
                                                    {bookings >= seats && <Box mb={3}><Alert severity="info">Alle Termine an diesem Tag sind ausgebucht.</Alert></Box>}
                                                    {slots.map((slot) => {
                                                        const numberOfDates = slot.seats - slot.bookings;

                                                        return (
                                                            <Typography
                                                                key={slot.date.toString()}
                                                                color={numberOfDates > 0 ? 'textPrimary' : 'textSecondary'}
                                                                className={classes.button}>
                                                                {slot.protected && <LockIcon style={{ marginRight: 5, fontSize: 16 }} />}{(new Date(slot.date)).toLocaleTimeString().replace(/(\d+:\d+):00/, '$1')} ({numberOfDates})
                                                            </Typography>);
                                                    })}
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )
                })}
        </>
    )
}

export default SlotOverview;