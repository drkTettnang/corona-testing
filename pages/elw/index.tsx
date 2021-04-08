import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Collapse, Container, createStyles, Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
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
import DashboardLayout from '../../components/layout/Dashboard';
import Welcome from '../../components/elw/Welcome';
import CustomCardHeader from '../../components/CustomCardHeader';
import AddToArchiv from '../../components/elw/AddToArchiv';

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
    const { locations, isLoading: locationsAreLoading } = useLocations();
    const { statistics, isLoading: isLoadingStatistics } = useStatistics();
    const [booking, setBooking] = useState<(Booking & { slot: (Slot & { location: Location }) })>();

    if (denied) return <p>Access Denied</p>

    if (booking) {
        return (
            <DashboardLayout>
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CustomCardHeader title="Buchungsdetails"></CustomCardHeader>
                                <CardContent>
                                    <ResultForm booking={booking} setBooking={setBooking} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Welcome />
                    </Grid>


                    <Grid item xs={12} md={4}>
                        <Card style={{ boxShadow: 'none' }}>
                            <CardContent style={{ height: 160, backgroundImage: 'url(/img/20210313_104009_98201.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <SearchForm setBooking={setBooking} />
                    </Grid>

                    {isLoadingStatistics ?
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <CircularProgress />
                                </CardContent>
                            </Card>
                        </Grid>
                        :
                        <>
                            <Grid item xs={12}>
                                <Card>
                                    <CustomCardHeader title="Ergebnisse"></CustomCardHeader>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            {Object.keys(statistics.results).map(dateKey => (
                                                <Grid key={dateKey} item xs={12} md={4} lg={3}>
                                                    <EvaluationChart date={new Date(dateKey)} results={statistics.results[dateKey]} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {statistics.bookings.today.length > 0 && <Grid item xs={12}>
                                <Card>
                                    <CustomCardHeader title="Heutige Buchungen"></CustomCardHeader>
                                    <CardContent>
                                        <TodayBookingChart today={statistics.bookings.today} />
                                    </CardContent>
                                </Card>
                            </Grid>}
                            <Grid item xs={12}>

                                <HistoryChart bookings={statistics.bookings.bookings} occupiedSlots={statistics.bookings.occupiedSlots} availableSlots={statistics.bookings.availableSlots} />

                            </Grid>
                            {statistics.bookings.weekly.length > 0 && <Grid item xs={12}>
                                <Card>
                                    <CustomCardHeader title="Wochenübersicht"></CustomCardHeader>
                                    <CardContent>
                                        <WeeklyTable weeks={statistics.bookings.weekly} />

                                    </CardContent>
                                </Card>
                            </Grid>}
                        </>
                    }

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CustomCardHeader title="Neue Termine anlegen"></CustomCardHeader>
                            <CardContent>
                                <NewSlotForm />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CustomCardHeader title="Tests nachtragen"></CustomCardHeader>
                            <CardContent>
                                <AddToArchiv />
                            </CardContent>
                        </Card>
                    </Grid>

                    {locationsAreLoading ?
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <CircularProgress />
                                </CardContent>
                            </Card>
                        </Grid> :
                        locations.filter(location => location.seats && location.seats > 0).map(location => <Grid item xs={12}>
                            <LocationSlots key={location.id} location={location} />
                        </Grid>)
                    }
                </Grid>
            </Container>

            <Box m={18}></Box>

        </DashboardLayout>
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