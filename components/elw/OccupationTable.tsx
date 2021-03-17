import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';
import { Slots } from '../../lib/swr';
import OccupationRow from './OccupationRow';
import { Location } from '@prisma/client';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    dates: Slots
    location: Location
}

const OccupationTable: React.FC<Props> = ({dates, location}) => {
    const classes = useStyles();

    const numOccupiedDates = Object.values(dates).reduce((i, j) => i+j.occupied, 0);
    const numAvailableDates = Object.values(dates).reduce((i, j) => i+j.seats, 0);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Uhrzeit</TableCell>
                        <TableCell></TableCell>
                        <TableCell>Reserviert</TableCell>
                        <TableCell>Plätze</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(dates).sort().map(dateString => <OccupationRow key={dateString} dateString={dateString} slotInfo={dates[dateString]} location={location} />)}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>{Object.keys(dates).length} Slots</TableCell>
                        <TableCell>{Math.round(100 - (numOccupiedDates / numAvailableDates) * 100) || 0}% noch frei</TableCell>
                        <TableCell>{numOccupiedDates}</TableCell>
                        <TableCell>{numAvailableDates}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default OccupationTable;