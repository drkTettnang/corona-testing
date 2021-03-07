import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button, Box, Typography, Checkbox, FormControlLabel, CircularProgress, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import DayJSUtils from '@date-io/dayjs';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import dayjs, { Dayjs } from 'dayjs';
import Countdown from './Countdown';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import Config from '../lib/Config';

const CustomTextField = ({ label, name, data, onChange, disabled }: { label: string, name: string, data: any, onChange: any, disabled?: boolean }) => {
  return <TextField
    label={label}
    name={name}
    value={data[name]}
    onChange={onChange}
    fullWidth
    required
    disabled={!!disabled}
    margin="dense"
    size="small" />
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    back: {
      marginBottom: theme.spacing(3),
    }
  }),
)

type Props = {
  date: Date,
  numberOfAdults: number,
  numberOfChildren: number,
  expiresOn: Date
}

const ApplicationForm: React.FC<Props> = ({ date, numberOfAdults, numberOfChildren, expiresOn }) => {
  const classes = useStyles();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [adults, setAdults] = useState(Array.from({ length: numberOfAdults }, () => ({
    firstName: '',
    lastName: '',
    street: '',
    postcode: '',
    city: '',
    birthday: null as Date,
    phone: '',
  })));
  const [children, setChildren] = useState(Array.from({ length: numberOfChildren }, () => ({
    firstName: '',
    lastName: '',
    street: '',
    postcode: '',
    city: '',
    birthday: null as Date,
    phone: '',
  })));

  const dateChangeFactory = (index: number, data: any) => {
    return (date: Dayjs) => {
      let newData = [...data];
      newData[index].birthday = date?.toDate();

      data === adults ? setAdults(newData) : setChildren(newData);
    }
  }

  const changeFactory = (index: number, data: any) => {
    return (ev: React.ChangeEvent<HTMLInputElement>) => {
      let newData = [...data];
      newData[index][ev.target.name] = ev.target.value;

      data === adults ? setAdults(newData) : setChildren(newData);
    }
  }

  const copyAddress = (adultIndex: number, targetIndex: number, target: any) => {
    let newData = [...target];
    newData[targetIndex] = {
      ...target[targetIndex],
      street: adults[adultIndex].street,
      postcode: adults[adultIndex].postcode,
      city: adults[adultIndex].city,
    };

    console.log('copy', adults[adultIndex], newData);

    target === adults ? setAdults(newData) : setChildren(newData);
  }

  const submitForm = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (processing) {
      return;
    }

    setError('');
    setProcessing(true);

    Axios.put('/api/apply', {
      date,
      applications: [
        ...adults,
        ...children,
      ]
    }).then(async () => {
      console.log('success');

      await mutate('/api/bookings');
      await mutate('/api/reservations');

      router.push('/booking');
    }).catch((err) => {
      if (err.response.data?.field) {
        setError(`Der Wert für "${err.response.data.field}" ist keine gültige Eingabe.`);
      } else if (err.response.data?.result === 'conflict') {
        setError('Leider gab es bei der Anmeldung ein Terminkonflikt. Bitte wählen Sie eine neue Uhrzeit.');
      } else {
        setError(`Ihre Anmeldung konnte nicht verarbeitet werden. (${err.response.data?.result})`);
      }

      setProcessing(false);
    });
  }

  const backToSelection = async () => {
    Axios.delete('/api/reserve').then(async () => {
      await mutate('/api/reservations');

      router.push('/selection');
    }).catch((err) => {
      console.log('Cant go back', err);
    })
  }

  return (
    <MuiPickersUtilsProvider utils={DayJSUtils}>
      <Grid container spacing={3} justify="center">
        <Grid item md={4} xs={12}>
          <Button variant="outlined" size="small" onClick={() => backToSelection()} className={classes.back}>Zurück</Button>

          <Typography variant="body1">Um Sie verbindlich für ihre Testung am <strong>{(new Date(date)).toLocaleString()}</strong> anzumelden,
          benötigen wir die folgenden Informationen von Ihnen innerhalb der nächsten <strong><Countdown date={(new Date(expiresOn)).toISOString()} /></strong> Minuten.</Typography>

          <form onSubmit={submitForm}>
            {Array.from({ length: numberOfAdults }, (_, i) => <Box key={i} mt={3} mb={3}>
              {numberOfAdults > 1 && <Typography variant="h5">{i + 1}. Person</Typography>}

              <CustomTextField label="Vorname" name="firstName" onChange={changeFactory(i, adults)} data={adults[i]} disabled={processing} />
              <CustomTextField label="Nachname" name="lastName" onChange={changeFactory(i, adults)} data={adults[i]} disabled={processing} />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD.MM.YYYY"
                margin="normal"
                label="Geburtstag"
                value={adults[i].birthday}
                onChange={dateChangeFactory(i, adults)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                minDate="1910-01-01T11:04:05.573Z"
                maxDate={dayjs(date).subtract(18, 'year').toDate()}
                minDateMessage="Maximales Alter beträgt 110"
                maxDateMessage="Person muss volljährig sein"
                fullWidth
                required
                disabled={processing}
              />
              <CustomTextField label="Telefon" name="phone" onChange={changeFactory(i, adults)} data={adults[i]} disabled={processing} />
              <Box mt={2}>
                {i > 0 && <Button color="secondary" onClick={() => copyAddress(0, i, adults)} disabled={processing}>Kopiere Adresse</Button>}
                <CustomTextField label="Straße + Nummer" name="street" onChange={changeFactory(i, adults)} data={adults[i]} disabled={processing} />
                <TextField
                  label="PLZ" name="postcode" value={adults[i].postcode} onChange={changeFactory(i, adults)}
                  fullWidth
                  required
                  margin="dense"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: 99999, min: 10000
                    }
                  }}
                  disabled={processing}
                  size="small" />
                <CustomTextField label="Ort" name="city" onChange={changeFactory(i, adults)} data={adults[i]} disabled={processing} />
              </Box>
            </Box>)}


            {Array.from({ length: numberOfChildren }, (_, i) => <Box key={i} mt={9} mb={3}>
              <Typography variant="h5">{i + 1}. Kind</Typography>

              <CustomTextField label="Vorname" name="firstName" onChange={changeFactory(i, children)} data={children[i]} disabled={processing} />
              <CustomTextField label="Nachname" name="lastName" onChange={changeFactory(i, children)} data={children[i]} disabled={processing} />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD.MM.YYYY"
                margin="normal"
                label="Geburtstag"
                value={children[i].birthday}
                onChange={dateChangeFactory(i, children)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                minDate={dayjs(date).subtract(18, 'year').toDate()}
                maxDate={dayjs(date).subtract(Config.MIN_AGE, 'year').toDate()}
                minDateMessage="Maximales Alter beträgt 17"
                maxDateMessage={`Mindestalter beträgt ${Config.MIN_AGE}`}
                fullWidth
                required
                disabled={processing}
              />
              <CustomTextField label="Telefon" name="phone" onChange={changeFactory(i, children)} data={children[i]} disabled={processing} />
              <Box mt={2}>
                {numberOfAdults > 0 && <Button color="secondary" onClick={() => copyAddress(0, i, children)} disabled={processing}>Kopiere Adresse</Button>}
                <CustomTextField label="Straße + Nummer" name="street" onChange={changeFactory(i, children)} data={children[i]} disabled={processing} />
                <TextField
                  label="PLZ" name="postcode" value={children[i].postcode} onChange={changeFactory(i, children)}
                  fullWidth
                  required
                  margin="dense"
                  type="number"
                  InputProps={{
                    inputProps: {
                      max: 99999, min: 10000
                    }
                  }}
                  disabled={processing}
                  size="small" />
                <CustomTextField label="Ort" name="city" onChange={changeFactory(i, children)} data={children[i]} disabled={processing} />
              </Box>
            </Box>)}

            <Box mb={2} mt={9}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="checkedB"
                    color="primary"
                    required
                  />
                }
                disabled={processing}
                labelPlacement="end"
                label={<span>Die <Link target="_blank" href={Config.HOMEPAGE_PRIVACY}>Datenschutz-Hinweise</Link> habe ich zur Kenntnis genommen.</span>}
              />
            </Box>

            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="checkedC"
                    color="primary"
                    required
                  />
                }
                disabled={processing}
                labelPlacement="end"
                label="Mir ist bewusst, dass durch die Anmeldung kein Anspruch auf Durchführung eines Schnelltests abgeleitet werden kann."
              />
            </Box>

            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    value="checkedD"
                    color="primary"
                    required
                  />
                }
                disabled={processing}
                labelPlacement="end"
                label="Hiermit bestätige ich, dass ich zu einer der berechtigten Personengruppen zähle."
              />
            </Box>


            <Button type="submit" variant="contained" color="primary" disabled={processing} fullWidth>
              {processing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Melde an</> : 'Verbindlich anmelden'}
            </Button>

            <Box m={3}>
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </form>
        </Grid>
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

export default ApplicationForm;