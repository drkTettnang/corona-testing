import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Image from 'next/image';

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
            <Image src="/drk-logo-tettnang-lang.svg" alt="Logo - DRK Tettnang e.V." height={60} width="auto" />
        </Grid>
    )
}

export default Header;