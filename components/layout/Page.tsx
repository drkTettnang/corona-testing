import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, Container, Grid, Link } from '@material-ui/core';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useBookings, useReservations } from '../../lib/swr';
import Stepper from '../Stepper';
import Alert from '@material-ui/lab/Alert';
import Footer from './Footer';
import WelcomeText from '../custom/WelcomeText';

const useStyles = makeStyles((theme) => ({
    header: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(10),
    },
    form: {
        margin: theme.spacing(12, 0),
    },
    spinner: {
        margin: 'auto',
    },
    alert: {
        margin: 'auto',
    },
}));

export default function Page({ children, activeStep }) {
    const classes = useStyles();
    const router = useRouter();
    const [session, sessionIsLoading] = useSession();
    const bookings = useBookings(!!session);
    const reservations = useReservations(!!session);
    const [error, setError] = useState<string>('');
    const [isRedirected, setIsRedirected] = useState(false);

    useEffect(() => {
        let targetPage = '/selection';

        if (!sessionIsLoading && !session) {
            targetPage = '/';
        } else if (!bookings.isLoading && bookings.data?.length > 0) {
            targetPage = '/booking';
        } else if (!reservations.isLoading && reservations.data?.date) {
            targetPage = '/application';
        }

        if (targetPage && targetPage !== router.pathname && router.pathname !== '/verify-request') {
            setIsRedirected(true);

            router.push(targetPage);
        }
    }, [sessionIsLoading, reservations.isLoading, bookings.isLoading]);

    if (!sessionIsLoading && session && bookings.isError) {
        setError('Der Status ihrer Anmeldungen konnte nicht überprüft werden. Versuchen Sie es später bitte nochmals.');
    }

    if (!sessionIsLoading && session && reservations.isError) {
        setError('Der Status ihrer Reservierung konnte nicht überprüft werden. Versuchen Sie es später bitte nochmals.');
    }

    return (
        <Container fixed>
            <Grid container justify="flex-end" alignContent="flex-start" className={classes.header}>
                <Image src="/drk-logo-tettnang-lang.svg" alt="Logo - DRK Tettnang e.V." height={60} width="auto" />
            </Grid>

            {(activeStep === 0 || activeStep == 3) && <WelcomeText />}

            <Box className={classes.form}>
                {session && <Grid container justify="flex-end" alignItems="center">
                    Guten Tag, {session.user.email ?? session.user.name}&nbsp;&nbsp;<Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="outlined">Abmelden</Button>
                </Grid>}

                <Stepper activeStep={activeStep} />

                {error ?
                    <Alert severity="warning" className={classes.alert}>{error}</Alert>
                    :
                    (sessionIsLoading || isRedirected || (session && (bookings.isLoading || reservations.isLoading)) ?
                        <Grid container justify="center" alignItems="center"><CircularProgress /></Grid>
                        :
                        children)}
            </Box>

            <Footer />

        </Container>
    );
}