import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, IconButton, Typography } from '@material-ui/core';
import OccupationTable from './OccupationTable';
import { Slots, useSlots } from '../../lib/swr';
import PrintIcon from '@material-ui/icons/Print';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import dayjs from 'dayjs';
import { Location } from '@prisma/client';

function getOccupationTableGroupedByDay(dates: Slots, location: Location) {
    const groupedByDay: { [day: string]: Slots } = {};

    for (const dateString in dates) {
        const date = new Date(dateString);
        const key = dayjs(date).format('YYYY-MM-DD');

        if (!groupedByDay[key]) {
            groupedByDay[key] = {};
        }

        groupedByDay[key][dateString] = dates[dateString];
    }

    return Object.keys(groupedByDay).sort().map(key => (
        <Box mb={6} key={key}>
            <Typography gutterBottom={true} variant="h6">
                {dayjs(key, 'YYYY-MM-DD').format('dddd, D. MMMM')}&nbsp;
                <IconButton target="print" href={`/elw/test-log/${location.id}/${key}`} aria-label="print" component="a">
                    <PrintIcon />
                </IconButton>
            </Typography>
            <OccupationTable dates={groupedByDay[key]} location={location} />
        </Box>
    ));
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        muted: {
            opacity: 0.7,
            fontSize: '0.7em',
        }
    }),
)

type Props = {
    location: Location
}

const LocationSlots: React.FC<Props> = ({ location }) => {
    const classes = useStyles();
    const { dates, isLoading: isLoadingDates } = useSlots(location.id);

    return (
        <Box mt={6} mb={12}>
            <Typography variant="h5" gutterBottom={true}><LocationOnIcon /> {location.name} <span className={classes.muted}>{location.address}</span></Typography>
            {isLoadingDates ?
                <CircularProgress />
                :
                getOccupationTableGroupedByDay(dates, location)
            }
        </Box>
    )
}

export default LocationSlots;