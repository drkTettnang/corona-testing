import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';
import { DATES_PER_SLOT } from '../lib/const';
import dates from '../pages/api/dates';
import { red, green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bar: {
            minWidth: 100,
            width: '100%',
            height: '1em',
            backgroundColor: red[500],
            '& div': {
                height: '100%',
                backgroundColor: green[500],
            }
        }
    }),
)

type Props = {
    dates: {[dateString: string]: number}
}

const OccupationTable: React.FC<Props> = ({dates}) => {
    const classes = useStyles();

    const numDates = Object.keys(dates).length * DATES_PER_SLOT;
    const numAvailableDates = Object.values(dates).reduce((i, j) => i+j, 0);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Reserviert</TableCell>
                        <TableCell>Plätze</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(dates).sort().map(dateString => {
                        let date = new Date(dateString);

                        return <TableRow key={dateString}>
                            <TableCell>{date.toLocaleString('de-DE')}</TableCell>
                            <TableCell><div className={classes.bar}><div style={{ width: (dates[dateString] / DATES_PER_SLOT * 100) + '%' }}></div></div></TableCell>
                            <TableCell>{DATES_PER_SLOT - dates[dateString]}</TableCell>
                            <TableCell>{DATES_PER_SLOT}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>{Object.keys(dates).length} Slots</TableCell>
                        <TableCell>{Math.round(numAvailableDates / numDates * 100)}% noch frei</TableCell>
                        <TableCell>{numDates - numAvailableDates}</TableCell>
                        <TableCell>{numDates}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default OccupationTable;