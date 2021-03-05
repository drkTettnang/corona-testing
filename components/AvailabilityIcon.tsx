import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { green, red, yellow } from '@material-ui/core/colors';
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
    }),
)

type Props = {
    seats: number
    occupied: number
}

const AvailabilityIcon: React.FC<Props> = ({ seats, occupied }) => {
    const classes = useStyles();
    const percentage = occupied / seats;

    return (
       <span className={classNames(classes.icon, {
           [classes.vacancy]: percentage <= 0.8,
           [classes.short]: percentage > 0.8 && percentage < 1,
           [classes.occupied]: percentage === 1,
       })}></span>
    )
}

export default AvailabilityIcon;