import React, { FunctionComponent, useState } from 'react'
import { Button, Box, CircularProgress, Grid, TextField, Typography } from '@material-ui/core'
import { signIn } from 'next-auth/client';
import Alert from '@material-ui/lab/Alert';

const EmailSignIn: FunctionComponent<{}> = () => {
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

    signIn('email', {
      email,
      callbackUrl: '/selection',
    }).then(() => {
      setSubmitted(true);
      setProcessing(false);
    }).catch(err => {
      setProcessing(false);
      setSubmitted(false);

      console.log(err);

      setError('E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später noch einmal.');
    });
  };

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