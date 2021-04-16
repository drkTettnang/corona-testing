import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayJSUtils from '@date-io/dayjs';
import axios from 'axios';
import { mutate } from 'swr';
import Alert from '@material-ui/lab/Alert';
import { Location, Slot } from '@prisma/client';
import { useLocations } from '../../lib/swr';
import dayjs from 'dayjs';

const createSlots = async (location: Location, slot: { date: Date, seats: number, count: number, gap: number, code: string }) => {
    if (location.id < 0) {
        const locationResponse = await axios.post('/api/location', location);

        location = locationResponse.data;
    }

    return axios.post(`/api/location/${location.id}/slot`, slot);
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fieldset: {
            '& >*': {
                margin: theme.spacing(1),
                minWidth: 130,
            }
        },
    }),
)

type Props = {

}

const NewSlotForm: React.FC<Props> = () => {
    const classes = useStyles();
    const [isProcessing, setProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState(dayjs().add(1, 'hour').minute(0).second(0).millisecond(0).toDate());
    const [seats, setSeats] = useState(1);
    const [count, setCount] = useState(1);
    const [gap, setGap] = useState(15);
    const [code, setCode] = useState('');
    const { locations, isLoading: locationsAreLoading } = useLocations();
    const [locationIndex, setLocationIndex] = useState<number>(-1);
    const [location, setLocation] = useState<Location>();

    useEffect(() => {
        if (locations && locationIndex >= 0 && locationIndex < locations.length) {
            setLocation(locations[locationIndex]);
        } else if (locations && locationIndex >= locations.length) {
            setLocation({
                id: -1,
                address: '',
                description: '',
                name: '',
                rollingBooking: false,
                testKitName: '',
            });
        } else {
            setLocation(undefined);
        }
    }, [locations, locationIndex]);

    if (locationsAreLoading) {
        return <CircularProgress />;
    }

    const submitForm = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        if (isProcessing) {
            return;
        }

        setError('');
        setProcessing(true);

        createSlots(location, {
            date: selectedDate,
            seats,
            count,
            gap,
            code,
        }).then(async () => {
            console.log('success');

            await mutate('/api/location');

            if (location.id > -1) {
                await mutate(`/api/location/${location.id}/slot`);
            }

            setProcessing(false);
        }).catch((err) => {
            if (err.response.data?.result === 'failed') {
                setError('Leider konnten keine Termine angelegt werden. Vermutlich existieren sie schon.');
            } else {
                setError(`Es konnten keine Termine angelegt werden. (${err.response.data?.result})`);
            }

            setProcessing(false);
        });
    }

    return (
        <MuiPickersUtilsProvider utils={DayJSUtils}>
            <form onSubmit={submitForm} autoComplete="off">
                <Box>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="select-location-label">Ort</InputLabel>
                        <Select
                            labelId="select-location-label"
                            value={locationIndex}
                            onChange={ev => setLocationIndex(parseInt(ev.target.value.toString(), 10))}
                        >
                            <MenuItem value={-1}>Bitte wählen</MenuItem>
                            {locations.map((location, index) => <MenuItem key={location.id} value={index}>{location.name}, {location.address}</MenuItem>)}
                            <MenuItem value={locations.length}>Neuer Ort</MenuItem>
                        </Select>
                    </FormControl>

                    {locationIndex === locations.length && location && <>
                        <TextField
                            required
                            fullWidth
                            placeholder="z.B. Gemeindehause Musterhausen"
                            label="Örtlichkeit"
                            variant="outlined"
                            margin="normal"
                            value={location.name}
                            onChange={ev => setLocation({ ...location, name: ev.target.value })}
                            size="small"
                            disabled={isProcessing}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Adresse"
                            placeholder="Musterstr. 5, 12345 Musterhausen"
                            variant="outlined"
                            margin="normal"
                            value={location.address}
                            onChange={ev => setLocation({ ...location, address: ev.target.value })}
                            size="small"
                            disabled={isProcessing}
                        />

                        <TextField
                            required
                            fullWidth
                            label="Testname"
                            variant="outlined"
                            margin="normal"
                            value={location.testKitName}
                            onChange={ev => setLocation({ ...location, testKitName: ev.target.value })}
                            size="small"
                            disabled={isProcessing}
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            margin="normal"
                            value={location.description}
                            onChange={ev => setLocation({ ...location, description: ev.target.value })}
                            size="small"
                            disabled={isProcessing}
                        />

                        <FormControlLabel
                            control={<Checkbox checked={location.rollingBooking} onChange={ev => setLocation({ ...location, rollingBooking: ev.target.checked })} />}
                            label="Kurzfristige Anmeldung möglich"
                        />
                    </>}

                    <DateTimePicker
                        ampm={false}
                        fullWidth
                        label="Datum / Uhrzeit"
                        inputVariant="outlined"
                        margin="normal"
                        required
                        size="small"
                        disabled={isProcessing || locationIndex < 0}
                        value={selectedDate}
                        onChange={date => setSelectedDate(date.second(0).millisecond(0).toDate())}
                        disablePast={true}
                        minutesStep={5}
                    />

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                required
                                fullWidth
                                label="Plätze"
                                type="number"
                                variant="outlined"
                                margin="normal"
                                value={seats}
                                onChange={ev => setSeats(parseInt(ev.target.value, 10))}
                                size="small"
                                disabled={isProcessing || locationIndex < 0}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        max: 100
                                    }
                                }} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <TextField
                                required
                                fullWidth
                                label="Wiederholungen"
                                type="number"
                                variant="outlined"
                                margin="normal"
                                value={count}
                                onChange={ev => setCount(parseInt(ev.target.value, 10))}
                                size="small"
                                disabled={isProcessing || locationIndex < 0}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        max: 160
                                    }
                                }} />
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <TextField
                                required
                                fullWidth
                                label="Abstand"
                                type="number"
                                variant="outlined"
                                margin="normal"
                                value={gap}
                                onChange={ev => setGap(parseInt(ev.target.value, 10))}
                                size="small"
                                disabled={isProcessing || locationIndex < 0 || count <= 1}
                                InputProps={{
                                    inputProps: {
                                        min: 5,
                                        max: 60,
                                    }
                                }} />
                        </Grid>
                        {count > 1 && <Grid item xs={12}>
                            <Typography variant="caption">
                                Der letzte Termin wäre um <strong>{dayjs(selectedDate).add(gap * (count - 1), 'minutes').toDate().toLocaleTimeString()}</strong>{' '}
                                        und insgesamt stünden <strong>{seats * count}</strong> Plätze zur Verfügung.</Typography>
                        </Grid>}
                    </Grid>

                    <TextField
                        fullWidth
                        label="Code"
                        variant="outlined"
                        margin="normal"
                        value={code}
                        onChange={ev => setCode(ev.target.value)}
                        size="small"
                        disabled={isProcessing || locationIndex < 0}
                        helperText="Sollte ein Code hinterlegt sein, benötigt man diesen zur Buchung."
                    />

                    <Box mt={1}>
                        <Button fullWidth type="submit" color="primary" variant="contained" disabled={isProcessing || locationIndex < 0}>
                            {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Lege an</> : 'Anlegen'}
                        </Button>
                    </Box>
                    {error && <Box mt={3}><Alert severity="warning">{error}</Alert></Box>}
                </Box>
            </form>
        </MuiPickersUtilsProvider>
    )
}

export default NewSlotForm;