import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, Container, Grid, Link, Typography } from '@material-ui/core';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useBookings, useReservations } from '../lib/swr';
import Stepper from './Stepper';
import Alert from '@material-ui/lab/Alert';
import Footer from './Footer';

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
            setError('Sie werden gleich weitergeleitet...');

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

            {(activeStep === 0 || activeStep == 3) && <>
                <Typography variant="h3" gutterBottom={true}>Corona-Testung</Typography>

                <Typography variant="body1" paragraph={true}>
                    Am 23. Dezember 2020 bieten wir am Manzenberg (Schulzentrum) eine kostenlose Corona-Antigen-Schnelltestung an.
                        </Typography>
                <Typography variant="body1" paragraph={true}>
                    Wir wollen mit dieser Aktion Risikogruppen schützen und Angehörigen von pflegebedürftigen oder chronisch kranken Menschen in den Stunden unmittelbar nach dem Test einen Weihnachtsbesuch bei Ihren Lieben ermöglichen.
                Leider können wir durch die Schnelltestmethode <strong>keinen 100% Schutz</strong> vor Ansteckung mit dem Coronavirus gewährleisten. Das Risiko wird lediglich reduziert. Deshalb darf unter keinen Umständen auf die inzwischen etablierten Abstands- und Hygieneregeln verzichtet werden. Halten Sie sich bitte weiterhin an die AHA-Formel (Abstand halten, Hygieneregeln beachten, Alltagsmaske tragen).
                </Typography>
                    <Typography variant="body1" paragraph={true}>
                        Wir gehen davon aus, dass wenn Sie sich zur Testung anmelden auch wissen, dass Sie unter Umständen zu den Personen gehören, die symptomlos infiziert sind und damit das Virus weitertragen, ohne dass Sie davon wissen.
                        In diesen Fällen hoffen wir, für Klarheit sorgen zu können und helfen damit das unkontrollierte Weiterverbreiten des Corona-Virus zu reduzieren. In einigen Fällen ist ein positives Ergebnis falsch positiv, deshalb ist eine anschließende PCR-Testung notwendig.
                </Typography>
                    <Typography variant="body1" paragraph={true}>
                        Wir appellieren an die Fairness aller, unsere Testkapazitäten sind begrenzt. Weitere Informationen erhalten Sie auf unserer <Link href="https://your.domain/testung">Corona Übersichtsseite</Link>.
                </Typography>
            </>}

            <Box className={classes.form}>
                {session && <Grid container justify="flex-end" alignItems="center">
                    Guten Tag, {session.user.email ?? session.user.name}&nbsp;&nbsp;<Button onClick={() => signOut({ callbackUrl: '/' })} size="small" variant="outlined">Abmelden</Button>
                </Grid>}

                <Stepper activeStep={activeStep} />

                {error ?
                    <Alert severity="warning" className={classes.alert}>{error}</Alert>
                    :
                    (sessionIsLoading || (session && (bookings.isLoading || reservations.isLoading)) ?
                        <Grid container justify="center" alignItems="center"><CircularProgress /></Grid>
                        :
                        children)}
            </Box>

            <Footer />

        </Container>
    );
}