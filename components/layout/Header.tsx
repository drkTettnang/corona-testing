import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Image from 'next/image';
import Config from '../../lib/Config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(14),
        },
    }),
)

type Props = {

}

const Header: React.FC<Props> = () => {
    const classes = useStyles();

    return (
        <Grid container justify="flex-end" alignContent="flex-start" className={classes.header}>
            <Image src={Config.LOGO} alt={`Logo ${Config.VENDOR_NAME}`} height={60} width="auto" />
        </Grid>
    )
}

export default Header;