import React, {  } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import EmailSignIn from '../components/EmailSignIn';
import { NextPage } from 'next';
import Page from "../components/layout/Page";

const useStyles = makeStyles(() =>
  createStyles({

  }),
)

interface Props {

}

const IndexPage: NextPage<Props> = () => {

  return (
    <Page activeStep={0}>
      <EmailSignIn />
    </Page>
  )
}

export default IndexPage;