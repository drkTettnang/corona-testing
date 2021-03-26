import React, { } from 'react';
import { Container, createStyles, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import DataProtectionBody from '../templates-example/DataProtectionBody';

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            '& h3': {
                marginTop: theme.spacing(6),
            },
            '& h4': {
                marginTop: theme.spacing(6),
            },
            '& h5': {
                marginTop: theme.spacing(6),
            }
        }
    }),
)

interface Props {

}

const DataProtectionPage: NextPage<Props> = ({ }) => {
    const classes = useStyles();

    return (
        <Container fixed className={classes.container}>
            <Header />

            <DataProtectionBody />

            <Footer />
        </Container>
    );
}

export default DataProtectionPage;