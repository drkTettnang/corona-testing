import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import DataProtectionBody from '../templates/DataProtectionBody';
import Config from '../lib/Config';
import DataProtectionCoronaWarnApp from './DataProtectionCoronaWarnApp';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            pageBreakAfter: 'always',
            fontSize: 10,
            '& p': {
                marginBottom: 8,
            },
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
           <DataProtectionBody>
                {Config.CWA && <DataProtectionCoronaWarnApp />}
            </DataProtectionBody>
       </div>
    )
}

export default DataProtectionPaper;