import React, {  } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { NextPage } from 'next';
import DateSelection from '../components/DateSelection';
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

const SelectionPage: NextPage<Props> = () => {

  return (
    <Page activeStep={1}>
      <DateSelection />
    </Page>
  )
}

export default SelectionPage;