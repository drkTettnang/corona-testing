import React, { FunctionComponent, useState } from 'react'
import { Button, Box, CircularProgress, Grid, TextField, Typography, createStyles, makeStyles } from '@material-ui/core'
import { signIn } from 'next-auth/client';
import Alert from '@material-ui/lab/Alert';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

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

const EmailSignIn: FunctionComponent<{}> = () => {
  const classes = useStyles();
  const [email, setEmail] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (processing || !email) {
      return;
    }

    setProcessing(true);
    setError('');

    signIn('email', {
      email,
      callbackUrl: '/selection',
      redirect: false,
    }).then((data: any) => {

      if (data.error) {
        throw new Error(data.error);
      }

      setSubmitted(true);
      setProcessing(false);
    }).catch(err => {
      setProcessing(false);
      setSubmitted(false);

      console.log(err);

      setError('E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später noch einmal.');
    });
  };

  if (submitted) {
    return (
      <Grid container spacing={3} justify="center" className={classes.main}>
        <Grid item md={6} xs={12}>
          <MailOutlineIcon className={classes.icon}></MailOutlineIcon>
          <Typography variant="h6" gutterBottom={true}>E-Mail versandt</Typography>
          <Typography variant="body1" gutterBottom={true}>Bitte rufen Sie nun ihre E-Mails für <strong>{email}</strong> ab und
            öffnen den zugesandten Link um mit der Anmeldung fortzufahren. Im Einzelfall kann die Zustellung
            mehrere Stunden dauern, abhängig von Ihrem E-Mail Anbieter.</Typography>

          <Box mt={4}>
            <Button variant="outlined" onClick={() => setSubmitted(false)}>Neue E-Mail anfordern</Button>
          </Box>
        </Grid>
      </Grid >
    )
  }

  return (
    <Grid container spacing={3} justify="center">
      <Grid item md={4} xs={12}>
        <Typography variant="body1">Bitte geben Sie eine gültige E-Mail Adresse ein, da wir Ihnen den Link zur weiteren Anmeldung
          und auch das Ergebnis ihres Tests via E-Mail zukommen lassen.</Typography>

        <form onSubmit={onSubmit}>
          <TextField
            required
            size="small"
            type="email"
            label="E-Mail Adresse"
            name="email"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            variant="outlined"
            fullWidth
            disabled={processing || submitted}
            margin="normal" />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={processing || submitted}>
            {processing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Versende E-Mail</> : (submitted ? 'E-Mail versandt' : 'Registrierung mit E-Mail')}
          </Button>

          <Box m={3}>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </form>
      </Grid>
    </Grid>
  )
}

export default EmailSignIn;