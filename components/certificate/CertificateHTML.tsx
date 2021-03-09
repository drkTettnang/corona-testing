import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper } from '@material-ui/core';
import Image from 'next/image';
import Footer from '../layout/Footer';
import CertificateBody from './CertificateBody';
import { Booking } from '@prisma/client';
import Config from '../../lib/Config';
import Header from '../layout/Header';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(14),
        },
        paper: {
            padding: theme.spacing(6),
        }
    }),
)

type Props = {
    booking: Booking
}

const CertificateHTML: React.FC<Props> = ({ booking }) => {
    const classes = useStyles();

    return (
        <Container fixed>
            <Header />

            <Grid container justify="center">
                <Paper elevation={3} className={classes.paper}>
                    <CertificateBody booking={booking} />
                </Paper>

            </Grid>

            <Footer />
        </Container>
    )
}

export default CertificateHTML;