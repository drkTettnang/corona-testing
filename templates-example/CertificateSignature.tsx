import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    date: Date,
}

const CertificateSignature: React.FC<Props> = ({ date }) => {
    const classes = useStyles();

    return (
        <Typography variant="body1">
            Tettnang, den {date.toLocaleDateString('de-DE')}<br />
            gez. Geschäftsstelle DRK Ortsverein Tettnang
        </Typography>
    )
}

export default CertificateSignature;