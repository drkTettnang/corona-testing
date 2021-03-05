import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { NextPage } from 'next';
import { useReservations } from "../lib/swr";
import ApplicationForm from "../components/ApplicationForm";
import Page from "../components/layout/Page";
import { useRouter } from 'next/router';

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
  const reservations = useReservations();
  const router = useRouter();

  useEffect(() => {
    if (!reservations.isLoading && Object.keys(reservations.data).length === 0) {
      router.push('/');
    }
  }, [reservations.isLoading]);

  return (
    <Page activeStep={2}>
      {!reservations.isLoading && Object.keys(reservations.data).length > 0 && <ApplicationForm date={reservations.data.date} expiresOn={reservations.data.expiresOn} numberOfAdults={reservations.data.numberOfAdults} numberOfChildren={reservations.data.numberOfChildren} />}
    </Page>
  )
}

export default ApplicationPage;