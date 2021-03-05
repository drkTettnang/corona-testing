import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';
import { Dates } from '../lib/swr';

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
    dates: Dates
}

const OccupationTable: React.FC<Props> = ({dates}) => {
    const classes = useStyles();

    const numOccupiedDates = Object.values(dates).reduce((i, j) => i+j.occupied, 0);
    const numAvailableDates = Object.values(dates).reduce((i, j) => i+j.seats, 0);

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
                        const date = new Date(dateString);
                        const availablePercentage = 1 - (dates[dateString].occupied / dates[dateString].seats);

                        return <TableRow key={dateString}>
                            <TableCell>{date.toLocaleString('de-DE')}</TableCell>
                            <TableCell><div className={classes.bar}><div style={{ width: (availablePercentage * 100) + '%' }}></div></div></TableCell>
                            <TableCell>{dates[dateString].occupied}</TableCell>
                            <TableCell>{dates[dateString].seats}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>{Object.keys(dates).length} Slots</TableCell>
                        <TableCell>{Math.round(100 - (numOccupiedDates / numAvailableDates) * 100) || 0}% noch frei</TableCell>
                        <TableCell>{numOccupiedDates}</TableCell>
                        <TableCell>{numAvailableDates}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default OccupationTable;