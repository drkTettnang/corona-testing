import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Link } from '@material-ui/core';
import Config from '../../lib/Config';

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
                <Link href={Config.HOMEPAGE}>{Config.VENDOR_NAME}</Link> &bull; <Link href={Config.HOMEPAGE_LEGAL}>Impressum</Link> &bull; <Link href={Config.HOMEPAGE_PRIVACY}>Datenschutz</Link> &bull; <Link href={'mailto:' + Config.CONTACT_MAIL}>{Config.CONTACT_MAIL}</Link>
            </Typography>
        </Grid>
    )
}

export default Footer;