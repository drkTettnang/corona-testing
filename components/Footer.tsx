import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        footer: {
            opacity: 0.7,
            minHeight: theme.spacing(18),
        },
    }),
)

type Props = {

}

const Footer: React.FC<Props> = () => {
    const classes = useStyles();

    return (
        <Grid container alignItems="center" className={classes.footer}>
            <Typography variant="body2">
                <Link href="https://your.domain">DRK Ortsverein Musterstadt e.V.</Link> &bull; <Link href="https://your.domain/impressum.html">Impressum</Link> &bull; <Link href="/data-protection">Datenschutz</Link> &bull; <Link href="mailto:mail@your.domain">mail@your.domain</Link>
            </Typography>
        </Grid>
    )
}

export default Footer;