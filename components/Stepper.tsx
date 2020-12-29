import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Stepper as MUIStepper, Step, StepLabel } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stepper: {
            marginBottom: theme.spacing(3),
        }
    }),
)

type Props = {
    activeStep: number
}

const Stepper: React.FC<Props> = ({activeStep}) => {
    const classes = useStyles();

    return (
        <MUIStepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
            <Step>
                <StepLabel>Registrierung</StepLabel>
            </Step>
            <Step>
                <StepLabel>Terminauswahl</StepLabel>
            </Step>
            <Step>
                <StepLabel>Anmeldung</StepLabel>
            </Step>
        </MUIStepper>
    )
}

export default Stepper;