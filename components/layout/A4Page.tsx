import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            pageBreakAfter: 'always',
            height: '100vh',
            position: 'relative',
        }
    }),
)

type Props = {

}

const A4Page: React.FC<Props> = ({children}) => {
    const classes = useStyles();

    return (
       <div className={classes.root}>
           {children}
       </div>
    )
}

export default A4Page;