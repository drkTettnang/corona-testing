import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ReactClock from 'react-clock';
import { useEffect } from 'react';
import 'react-clock/dist/Clock.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {

}

const Clock: React.FC<Props> = () => {
    const classes = useStyles();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(
            () => setCurrentDate(new Date()),
            1000
        );

        return () => {
            clearInterval(interval);
        }
    }, []);

    return <ReactClock value={currentDate} />;
}

export default Clock;