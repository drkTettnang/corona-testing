import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';
import dayjs from 'dayjs';
import AvailabilityIcon from '../AvailabilityIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Slots } from '../../lib/swr';
import { Location } from '@prisma/client';
import PrintIcon from '@material-ui/icons/Print';
import OccupationRow from './OccupationRow';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        muted: {
            opacity: 0.7,
            fontSize: '0.7em',
        },
    }),
)

type Props = {
    id: string
    dates: Slots
    location: Location
}

const DaySlots: React.FC<Props> = ({ dates, location, id }) => {
    const classes = useStyles();
    const [isExpanded, setExpanded] = useState(false);

    const numOccupiedDates = Object.values(dates).reduce((i, j) => i + j.occupied, 0);
    const numAvailableDates = Object.values(dates).reduce((i, j) => i + j.seats, 0);

    return (
        <Box>
            <Typography gutterBottom={true} variant="h6">
                <AvailabilityIcon occupied={numOccupiedDates} seats={numAvailableDates} />{' '}
                {dayjs(id, 'YYYY-MM-DD').format('dddd, D. MMMM')}{' '}
                <span className={classes.muted}>
                    {numOccupiedDates} / {numAvailableDates} ({Math.round(numOccupiedDates / numAvailableDates * 100) || 0}% Auslastung)
                </span>{' '}
                <IconButton target="print" href={`/elw/test-log/${location.id}/${id}`} aria-label="print" component="a">
                    <PrintIcon />
                </IconButton>
                <IconButton onClick={() => setExpanded(!isExpanded)}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Typography>
            {isExpanded && <Box mb={6}>
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
            </Box>}
        </Box>
    );
}

export default DaySlots;