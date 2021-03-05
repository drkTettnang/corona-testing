import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { green, grey, red, yellow } from '@material-ui/core/colors';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            width: '1em',
            height: '1em',
            display: 'inline-block',
            marginBottom: -2,
            borderRadius: '50%',
        },
        vacancy: {
            backgroundColor: green[500]
        },
        occupied: {
            backgroundColor: red[500]
        },
        short: {
            backgroundColor: yellow[500]
        },
        disabled: {
            backgroundColor: grey[500]
        }
    }),
)

type Props = {
    seats: number
    occupied: number
    disabled?: boolean
}

const AvailabilityIcon: React.FC<Props> = ({ seats, occupied, disabled = false }) => {
    const classes = useStyles();
    const percentage = occupied / seats;

    return (
       <span className={classNames(classes.icon, {
           [classes.disabled]: disabled,
           [classes.vacancy]: percentage <= 0.8 && !disabled,
           [classes.short]: percentage > 0.8 && percentage < 1 && !disabled,
           [classes.occupied]: percentage === 1 && !disabled,
       })}></span>
    )
}

export default AvailabilityIcon;