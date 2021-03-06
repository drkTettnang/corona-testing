import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';
import Image from 'next/image';
import Footer from '../layout/Footer';
import CertificateBody from './CertificateBody';
import { Booking } from '@prisma/client';
import Config from '../../lib/Config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(14),
        },
        paper: {
            '& >div': {
                padding: theme.spacing(6),
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                backgroundColor: '#fff',
            }
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
            <Grid container justify="flex-end" alignContent="flex-start" className={classes.header}>
                <a href="/"><Image src="/drk-logo-tettnang-lang.svg" alt={`Logo - ${Config.VENDOR_NAME}`} height={60} width="auto" /></a>
            </Grid>

            <Grid container justify="center" className={classes.paper}>
                <CertificateBody booking={booking} />
            </Grid>

            <Footer />
        </Container>
    )
}

export default CertificateHTML;