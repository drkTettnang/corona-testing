import React, { useState } from 'react';
import { Box, CircularProgress, Container, createStyles, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { getSession } from 'next-auth/client';
import Image from 'next/image';
import { useDates } from '../../lib/swr';
import OccupationTable from '../../components/OccupationTable';
import SearchForm from '../../components/SearchForm';
import { Booking } from '@prisma/client';
import ResultForm from '../../components/ResultForm';

const useStyles = makeStyles((theme) =>
    createStyles({
        header: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(14),
        },

    }),
)

interface Props {
    denied: boolean
}

const ELWPage: NextPage<Props> = ({ denied }) => {
    const classes = useStyles();
    const { dates, isLoading: isLoadingDates } = useDates();
    const [booking, setBooking] = useState<Booking>();

    if (denied) return <p>Access Denied</p>

    return (
        <Container fixed>
            <Grid container justify="flex-end" alignContent="flex-start" className={classes.header}>
                <Image src="/drk-logo-tettnang-lang.svg" alt="Logo - DRK Tettnang e.V." height={60} width="auto" />
            </Grid>
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

                    <Typography variant="h4">Auslastung</Typography>
                    {isLoadingDates ?
                        <CircularProgress />
                        :
                        <OccupationTable dates={dates} />
                    }
                </>
            }
        </Container>
    );
}

export default ELWPage;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session && process.env.MODERATORS && process.env.MODERATORS.split(',').includes(session.user?.email)) {
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