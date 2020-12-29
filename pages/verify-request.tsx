import React, { } from 'react';
import { Box, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { NextPage } from 'next';
import Page from "../components/Page";

const useStyles = makeStyles(() =>
    createStyles({
        main: {
            textAlign: 'center',
        },
        icon: {
            fontSize: '5em',
        },
    }),
)

interface Props {

}

const IndexPage: NextPage<Props> = () => {
    const classes = useStyles();

    return (
        <Page activeStep={0}>
            <Box m={12} className={classes.main}>
                <MailOutlineIcon className={classes.icon}></MailOutlineIcon>
                <Typography variant="h6" gutterBottom={true}>E-Mail versandt</Typography>
                <Typography variant="body1">Bitte rufen Sie nun ihre E-Mails ab und öffnen den zugesandten Link um mit der
                    Anmeldung fortzufahren. Im Einzelfall kann die Zustellung mehrere Stunden dauern, abhängig von Ihrem
                    E-Mail Anbieter.</Typography>
            </Box>
        </Page>
    )
}

export default IndexPage;