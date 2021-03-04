import React, { } from 'react';
import { Box, createStyles, Link, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { useBookings } from "../lib/swr";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green, grey, red, yellow } from "@material-ui/core/colors";
import Page from "../components/layout/Page";

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
    }
  }),
)

interface Props {

}

const BookingPage: NextPage<Props> = () => {
  const classes = useStyles();
  const bookings = useBookings();

  return (
    <Page activeStep={3}>
      <Box className={classes.info}>
        <CheckCircleOutlineIcon className={classes.icon} />
        <Typography variant="h4" gutterBottom={true}>Anmeldung erfolgreich abgeschlossen</Typography>

        <Typography variant="body1" paragraph={true}>Ihre Terminreservierung wurde erfolgreich verarbeitet und wir freuen uns Sie pünktlich zu den unten
          angezeigten Zeiten begrüßen zu dürfen. Bitte beachten Sie die Hinweise zur Durchführung inklusive Anfahrt auf unserer <Link href="https://drk-tettnang.de/testung">Corona Übersichtsseite</Link>.
          Sobald Ihre Ergebnisse vorliegen erhalten Sie für alle Personen eine separate E-Mail an die registrierte Adresse.</Typography>

      </Box>

      <TableContainer>
        <Table>
          <TableHead className={classes.header}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Termin</TableCell>
              <TableCell>Ergebnis</TableCell>
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
                <TableCell>{booking.firstName} {booking.lastName}</TableCell>
                <TableCell>{(new Date(booking.date)).toLocaleString()}</TableCell>
                <TableCell className={classes[booking.result || 'unknown']}>{results[booking.result || 'unknown']}</TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  )
}

export default BookingPage;