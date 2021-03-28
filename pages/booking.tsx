import React, { useState } from 'react';
import { Box, Button, CircularProgress, createStyles, IconButton, Link, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Axios from 'axios';
import { useBookings } from "../lib/swr";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green, grey, red, yellow } from "@material-ui/core/colors";
import Page from "../components/layout/Page";
import Config from '../lib/Config';
import { useRouter } from 'next/router';
import { generatePublicId } from '../lib/helper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { mutate } from 'swr';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stepper: {
      marginBottom: theme.spacing(3),
    },
    header: {
      '& th': {
        fontWeight: 'bold',
      }
    },
    unknown: {
      backgroundColor: yellow[100],
    },
    invalid: {
      backgroundColor: grey[100],
    },
    positiv: {
      backgroundColor: red[100],
    },
    negativ: {
      backgroundColor: green[100],
    },
    info: {
      textAlign: 'center',
      margin: theme.spacing(12, 6),
    },
    icon: {
      fontSize: '5em',
      color: green[800],
    },
    button: {
      margin: theme.spacing(0, 1),
    },
  }),
)

interface Props {

}

const BookingPage: NextPage<Props> = () => {
  const classes = useStyles();
  const bookings = useBookings();
  const router = useRouter();
  const [cancelId, setCancelId] = useState<number>();
  const [isCancelProcessing, setCancelProcessing] = useState(false);
  const [error, setError] = useState('');

  const onCancel = (bookingId: number) => {
    setCancelProcessing(true);
    setError('');

    Axios.delete('/api/booking/' + bookingId).then(async () => {
      await mutate('/api/bookings');

      setCancelId(undefined);
      setCancelProcessing(false);
    }).catch(() => {
      setCancelProcessing(false);
      setError('Buchung konnte nicht storniert werden.');
    });
  }

  return (
    <Page activeStep={3}>
      <Box className={classes.info}>
        <CheckCircleOutlineIcon className={classes.icon} />
        <Typography variant="h4" gutterBottom={true}>Anmeldung erfolgreich abgeschlossen</Typography>

        <Typography variant="body1" paragraph={true}>Ihre Terminreservierung wurde erfolgreich verarbeitet und wir
          freuen uns Sie pünktlich zu den unten angezeigten Zeiten begrüßen zu dürfen. Bitte beachten Sie die Hinweise
          zur Durchführung inklusive Anfahrt auf unserer <Link href={Config.HOMEPAGE}>Corona Übersichtsseite</Link>.
          Sobald Ihre Ergebnisse vorliegen erhalten Sie für alle Personen eine separate E-Mail an die registrierte Adresse.</Typography>

        {(bookings.data?.length < Config.MAX_DATES || Config.MAX_DATES < 0) && <Button onClick={() => router.push('/selection')} variant="contained" color="primary">Weiteren Termin reservieren</Button>}
      </Box>

      <TableContainer>
        <Table>
          <TableHead className={classes.header}>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Termin</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Ergebnis</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.data?.map(booking => {
              const results = {
                invalid: 'ungültig',
                unknown: 'unbekannt',
                positiv: 'positiv',
                negativ: 'negativ',
              };

              return <TableRow key={booking.id}>
                <TableCell>{generatePublicId(booking.id)}</TableCell>
                <TableCell>{booking.firstName} {booking.lastName}</TableCell>
                <TableCell>{(new Date(booking.date)).toLocaleString()}</TableCell>
                <TableCell>{booking.slot.location.address}</TableCell>
                <TableCell className={classes[booking.result || 'unknown']}>{results[booking.result || 'unknown']}</TableCell>
                <TableCell align="right">{(booking.result === 'unknown' && new Date(booking.date) > new Date()) && (
                  cancelId === booking.id
                    ?
                    <>
                      <Button size="small" startIcon={isCancelProcessing ? <CircularProgress size="1em" color="inherit" /> : <DeleteForeverIcon />} className={classes.button} color="primary" variant="contained" onClick={() => onCancel(booking.id)} disabled={isCancelProcessing}>Stornieren</Button>
                      <IconButton size="small" className={classes.button} onClick={() => setCancelId(undefined)} disabled={isCancelProcessing}><CloseIcon /></IconButton>
                    </>
                    :
                    <IconButton size="small" onClick={() => setCancelId(booking.id)} disabled={(cancelId && cancelId !== booking.id) || isCancelProcessing || new Date(booking.date) < new Date()}><DeleteForeverIcon /></IconButton>
                )}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {error && <Box m={8}><Alert severity="error">{error}</Alert></Box>}
    </Page>
  )
}

export default BookingPage;