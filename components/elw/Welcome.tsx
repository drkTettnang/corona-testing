import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Typography, Button, Box, Card, CardContent } from '@material-ui/core';
import { grey, red } from '@material-ui/core/colors';
import Image from 'next/image';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            boxShadow: 'none',
            textAlign: 'center',
            backgroundColor: red[50],
            [theme.breakpoints.up('md')]: {
                display: 'flex',
                textAlign: 'left',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            },
            [theme.breakpoints.up('xl')]: {
                height: 320
            }
        },
        content: {
            paddingLeft: theme.spacing(5),
        },
        title: {
            color: grey[800],
        },
        subtitle: {
            color: grey[800],
        },
    }),
)

type Props = {
    displayName?: string,
    className?: string,
}

const Welcome: React.FC<Props> = ({ displayName, className, ...other }) => {
    const classes = useStyles();

    return (
        <Card className={clsx(classes.root, className)} {...other}>
            <CardContent className={classes.content}>
                <Typography gutterBottom variant="h4" className={classes.title}>
                    Willkommen zurück
                    {!!displayName && <span>,<br />{displayName}</span>}!
                </Typography>

                <Typography
                    variant="body2"
                    className={classes.subtitle}>
                    Immer dran denken: Schön grinsen und nicken!
                </Typography>
            </CardContent>
            <img
                title="Icons made by Freepik from www.flaticon.com"
                alt="welcome"
                src="/img/covid-test.svg"
                style={{
                    height: 100,
                    margin: 32,
                }}
            />
        </Card>
    )
}

export default Welcome;