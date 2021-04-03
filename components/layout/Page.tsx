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
import WelcomeText from '../../templates/WelcomeText';
import Config from '../../lib/Config';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
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
    const [isRedirected, setIsRedirected] = useState(true);

    useEffect(() => {
        if (sessionIsLoading || ((bookings.isLoading || reservations.isLoading) && !sessionIsLoading && session)) {
            return;
        }

        let targetPage: string;

        if (!session) {
            targetPage = '/';
        } else if (reservations.data?.slot?.date) {
            targetPage = '/application';
        } else if (!bookings.data || bookings.data?.length === 0) {
            targetPage = '/selection';
        } else if ((bookings.data?.length >= Config.MAX_DATES && Config.MAX_DATES > -1) || router.pathname === '/') {
            targetPage = '/booking';
        }

        if (targetPage && targetPage !== router.pathname && router.pathname !== '/verify-request') {
            router.push(targetPage);
        } else {
            setIsRedirected(false);
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
            <Header />

            {Config.MAINTENANCE_MESSAGE && <Box m={6} marginBottom={18}><Alert severity="info">{Config.MAINTENANCE_MESSAGE}</Alert></Box>}

            {(activeStep === 0 || activeStep == 3) && <WelcomeText />}

            <Box className={classes.form}>
                {session && <Grid container justify="flex-end" alignItems="center" spacing={1}>
                    <Grid item>Guten Tag, {session.user.email ?? session.user.name}</Grid>
                    <Grid item>
                        <Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="outlined">Abmelden</Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => router.push('/booking')} disabled={router.pathname === '/booking' || bookings.isLoading || bookings.data?.length === 0} size="small" variant="outlined">Buchungen</Button>
                    </Grid>
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