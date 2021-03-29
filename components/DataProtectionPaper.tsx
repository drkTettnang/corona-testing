import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import DataProtectionBody from '../templates/DataProtectionBody';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            pageBreakAfter: 'always',
            fontSize: 10,
            '& *': {
                fontSize: '1em',
            },
            '& h3': {
                fontSize: '1.4em',
            },
            '& h4': {
                fontSize: '1.2em',
            }
        }
    }),
)

type Props = {

}

const DataProtectionPaper: React.FC<Props> = () => {
    const classes = useStyles();

    return (
       <div className={classes.root}>
           <DataProtectionBody />
       </div>
    )
}

export default DataProtectionPaper;