import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, IconButton, TextField, Typography } from '@material-ui/core';
import OccupationTable from './OccupationTable';
import { Slots, useSlots } from '../../lib/swr';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import dayjs from 'dayjs';
import { Location } from '@prisma/client';
import axios from 'axios';
import { mutate } from 'swr';

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
    const [isEditing, setEditing] = useState(false);
    const [isProcessing, setProcessing] = useState(false);
    const [name, setName] = useState(location.name);
    const [address, setAddress] = useState(location.address);
    const [description, setDescription] = useState(location.description || '');

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        setProcessing(true);

        axios.put(`/api/location/${location.id}`, {
            name,
            address,
            description,
        }).then((response) => {
            console.log('success', response.data);

            return mutate(`/api/location`);
        }).catch(err => {
            console.log('error', err);
        }).then(() => {
            setEditing(false);
            setProcessing(false);
        });
    };

    return (
        <Box mt={6} mb={12}>
            {(isLoadingDates || (dates && Object.keys(dates).length > 0)) && (isEditing ?
                <form onSubmit={onSubmit}>
                    <TextField
                        required
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                        size="small"
                        disabled={isProcessing}
                    />
                    {' '}
                    <TextField
                        required
                        label="Adresse"
                        variant="outlined"
                        value={address}
                        onChange={ev => setAddress(ev.target.value)}
                        size="small"
                        disabled={isProcessing}
                    />
                    {' '}
                    <TextField
                        label="Beschreibung"
                        variant="outlined"
                        value={description}
                        onChange={ev => setDescription(ev.target.value)}
                        size="small"
                        disabled={isProcessing}
                    />
                    <IconButton disabled={isProcessing} type="submit">
                        {isProcessing ? <CircularProgress size="1em" color="inherit" /> : <CheckIcon />}
                    </IconButton>
                </form>
                :
                <Typography variant="h5" gutterBottom={true}>
                    <LocationOnIcon /> {location.name} <span className={classes.muted}>{location.address}</span> <IconButton onClick={() => setEditing(true)}><EditIcon /></IconButton>
                </Typography>
            )}
            {isLoadingDates ?
                <CircularProgress />
                :
                getOccupationTableGroupedByDay(dates, location)
            }
        </Box>
    )
}

export default LocationSlots;