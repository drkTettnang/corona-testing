import React, { useState } from 'react';
import { Box, CircularProgress, Container, createStyles, Grid, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { getSession } from 'next-auth/client';
import { Dates, useDates, useStatistics } from '../../lib/swr';
import OccupationTable from '../../components/elw/OccupationTable';
import SearchForm from '../../components/elw/SearchForm';
import { Booking } from '@prisma/client';
import ResultForm from '../../components/elw/ResultForm';
import { isModerator } from '../../lib/authorization';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import NewDateForm from '../../components/elw/NewDateForm';
import PrintIcon from '@material-ui/icons/Print';
import Header from '../../components/layout/Header';
import 'dayjs/locale/de';
import EvaluationChart from '../../components/elw/EvaluationChart';
import dynamic from 'next/dynamic';

const HistoryChart = dynamic(
    () => import('../../components/elw/HistoryChart'),
    { ssr: false }
);

dayjs.locale('de');
dayjs.extend(customParseFormat);

const useStyles = makeStyles((theme) =>
    createStyles({

    }),
)

function getOccupationTableGroupedByDay(dates: Dates) {
    const groupedByDay: {[day: string]: Dates} = {};

    for (const dateString in dates) {
        const date = new Date(dateString);
        const key = dayjs(date).format('YYYY-MM-DD');

        if (!groupedByDay[key]) {
            groupedByDay[key] = {};
        }

        groupedByDay[key][dateString] = dates[dateString];
    }

    return Object.keys(groupedByDay).sort().map(key => (
        <Box mb={6} key={key}>
            <Typography gutterBottom={true} variant="h5">{dayjs(key, 'YYYY-MM-DD').format('dddd, D. MMMM')} <IconButton target="print" href={`/elw/test-log/${key}`} aria-label="print" component="a"><PrintIcon /></IconButton></Typography>
            <OccupationTable dates={groupedByDay[key]} />
        </Box>
    ));
}

interface Props {
    denied: boolean
}

const ELWPage: NextPage<Props> = ({ denied }) => {
    const classes = useStyles();
    const { dates, isLoading: isLoadingDates } = useDates();
    const { statistics, isLoading: isLoadingStatistics } = useStatistics();
    const [booking, setBooking] = useState<Booking>();

    if (denied) return <p>Access Denied</p>

    return (
        <Container fixed>
            <Header/>

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
                                <Grid item xs={12} md={4} lg={3}>
                                    <EvaluationChart date={new Date(dateKey)} results={statistics.results[dateKey]} />
                                </Grid>
                            ))}
                            {/* <Grid item xs={12} md={8} lg={6}>
                                <Paper>
                                {statistics.bookings.today.map(row => <Typography key={row.createdAt}>Um {dayjs(row.createdAt).format('HH:mm')} wurde ein Termin für den {dayjs(row.date).format('DD.MM.')} gebucht.</Typography>)}
                                </Paper>
                            </Grid> */}
                            <Grid item xs={12}>
                                <HistoryChart bookings={statistics.bookings.bookings} occupiedSlots={statistics.bookings.occupiedSlots} availableSlots={statistics.bookings.availableSlots} />
                            </Grid>
                        </Grid>
                    }

                    <Box m={6}></Box>

                    <Typography variant="h4" gutterBottom={true}>Termine</Typography>
                    {isLoadingDates ?
                        <CircularProgress />
                        :
                        getOccupationTableGroupedByDay(dates)
                    }
                    <NewDateForm />

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