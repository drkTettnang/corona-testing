import { signIn, signOut, useSession } from "next-auth/client";
import React, { useEffect, useState } from 'react';
import { CircularProgress, Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import { NextPage } from 'next';
import { csrfToken } from 'next-auth/client'
import DateSelection from '../components/DateSelection';
import Stepper from "../components/Stepper";
import { useRouter } from "next/router";
import { useBookings, useReservations } from "../lib/swr";
import ApplicationForm from "../components/ApplicationForm";
import Page from "../components/Page";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stepper: {
            marginBottom: theme.spacing(3),
        }
    }),
)

interface Props {

}

const ApplicationPage: NextPage<Props> = () => {
  const classes = useStyles();
  const reservations = useReservations();

  return (
    <Page activeStep={2}>
      {!reservations.isLoading && Object.keys(reservations.data).length > 0 && <ApplicationForm date={reservations.data.date} expiresOn={reservations.data.expiresOn} numberOfAdults={reservations.data.numberOfAdults} numberOfChildren={reservations.data.numberOfChildren} />}
    </Page>
  )
}

export default ApplicationPage;