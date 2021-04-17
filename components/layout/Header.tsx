import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import Image from 'next/image';
import Config from '../../lib/Config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(14),
        },
        slimHeader: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(3),
        }
    }),
)

type Props = {
    slim?: boolean,
}

const Header: React.FC<Props> = ({ slim, children }) => {
    const classes = useStyles();

    return (
        <Box display="flex" justifyContent="flex-end" alignItems="flex-start" className={slim ? classes.slimHeader : classes.header}>
            {children}
            <Box flexGrow={1}></Box>
            <Box>
                <Image src={Config.LOGO} alt={`Logo ${Config.VENDOR_NAME}`} height={60} width="auto" />
            </Box>
        </Box>
    )
}

export default Header;