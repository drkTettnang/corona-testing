import React, { useState } from 'react';
import { Box, Button, CircularProgress, Collapse, Container, createStyles, Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { getSession, signOut, useSession } from 'next-auth/client';
import { Slots, useLocations, useSlots, useStatistics } from '../../lib/swr';
import OccupationTable from '../../components/elw/OccupationTable';
import SearchForm from '../../components/elw/SearchForm';
import { Booking, Slot, Location } from '@prisma/client';
import ResultForm from '../../components/elw/ResultForm';
import { isModerator } from '../../lib/authorization';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import NewSlotForm from '../../components/elw/NewSlotForm';
import Header from '../../components/layout/Header';
import 'dayjs/locale/de';
import EvaluationChart from '../../components/elw/EvaluationChart';
import dynamic from 'next/dynamic';
import LocationSlots from '../../components/elw/LocationSlots';
import { useRouter } from 'next/router';
import WeeklyTable from '../../components/elw/WeeklyTable';

const HistoryChart = dynamic(
    () => import('../../components/elw/HistoryChart'),
    { ssr: false }
);

const TodayBookingChart = dynamic(
    () => import('../../components/elw/TodayBookingChart'),
    { ssr: false }
);

dayjs.locale('de');
dayjs.extend(customParseFormat);

const useStyles = makeStyles((theme) =>
    createStyles({
        paddedPaper: {
            padding: theme.spacing(2),
        }
    }),
)



interface Props {
    denied: boolean
}

const ELWPage: NextPage<Props> = ({ denied }) => {
    const classes = useStyles();
    const router = useRouter();
    const [session, sessionIsLoading] = useSession();
    const { locations, isLoading: locationsAreLoading } = useLocations();
    const { statistics, isLoading: isLoadingStatistics } = useStatistics();
    const [booking, setBooking] = useState<(Booking & { slot: (Slot & { location: Location }) })>();
    const [todayIn, setTodayIn] = useState(false);

    if (denied) return <p>Access Denied</p>

    return (
        <Container fixed>
            <Header />

            {session && <Grid container justify="flex-end" alignItems="center" spacing={1}>
                <Grid item>Guten Tag, {session.user.email ?? session.user.name}</Grid>
                <Grid item>
                    <Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="outlined">Abmelden</Button>
                </Grid>
                <Grid item>
                    <Button onClick={() => router.push('/')} size="small" variant="outlined">Home</Button>
                </Grid>
            </Grid>}

            <Typography variant="h3" gutterBottom={true}>Bereich ELW</Typography>
            <Typography variant="body1">Immer dran denken: Schön grinsen und nicken!</Typography>

            <Box m={6}></Box>

            {booking ?
                <>
                    <Typography variant="h4">Eintragung</Typography>
                    <ResultForm booking={booking} setBooking={setBooking} />
                </>
                :
                <>
                    <Typography variant="h4">Suche</Typography>
                    <SearchForm setBooking={setBooking} />

                    <Box m={6}></Box>

                    <Typography variant="h4" gutterBottom={true}>Ergebnisse</Typography>
                    {isLoadingStatistics ?
                        <CircularProgress />
                        :
                        <Grid container spacing={3}>
                            {Object.keys(statistics.results).map(dateKey => (
                                <Grid key={dateKey} item xs={12} md={4} lg={3}>
                                    <EvaluationChart date={new Date(dateKey)} results={statistics.results[dateKey]} />
                                </Grid>
                            ))}
                            {statistics.bookings.today.length > 0 && <Grid item xs={12}>
                                <TodayBookingChart today={statistics.bookings.today} />
                            </Grid>}
                            <Grid item xs={12}>
                                <HistoryChart bookings={statistics.bookings.bookings} occupiedSlots={statistics.bookings.occupiedSlots} availableSlots={statistics.bookings.availableSlots} />
                            </Grid>
                            {statistics.bookings.weekly.length > 0 && <Grid item xs={12}>
                                <Paper>
                                    <Box m={3}>
                                        <WeeklyTable weeks={statistics.bookings.weekly} />
                                    </Box>
                                </Paper>
                            </Grid>}
                        </Grid>
                    }

                    <Box m={6}></Box>

                    <Typography variant="h4" gutterBottom={true}>Termine</Typography>
                    {locationsAreLoading ?
                        <CircularProgress />
                        :
                        locations.map(location => <LocationSlots key={location.id} location={location} />)
                    }
                    <NewSlotForm />

                    <Box m={18}></Box>
                </>
            }
        </Container>
    );
}

export default ELWPage;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (isModerator(session)) {
        return {
            props: { denied: false }, // will be passed to the page component as props
        }
    }

    return {
        props: {
            denied: true,
        }
    }
}