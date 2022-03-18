import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { DateTimePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayJSUtils from '@date-io/dayjs';
import axios from 'axios';
import { mutate } from 'swr';
import Alert from '@material-ui/lab/Alert';
import { useLocations } from '../../lib/swr';

type Data = { firstName: string, lastName: string, birthday: Date, date: Date, evaluatedAt: Date, result: string, testKitName: string, locationId: number };

const blankData: Data = {
    firstName: '',
    lastName: '',
    birthday: new Date(),
    date: new Date(),
    evaluatedAt: new Date(),
    result: '',
    testKitName: '',
    locationId: -1,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    }),
)


type Props = {

}

const AddToArchiv: React.FC<Props> = () => {
    const classes = useStyles();
    const [isProcessing, setProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<Data>(blankData);
    const { locations, isLoading: locationsAreLoading } = useLocations();
    const [locationIndex, setLocationIndex] = useState<number>(-1);

    useEffect(() => {
        if (locationIndex >= 0) {
            setData({ ...data, testKitName: locations[locationIndex].testKitName, locationId: locations[locationIndex].id });
        }
    }, [locationIndex]);

    useEffect(() => {
        setData({...data, evaluatedAt: data.date});
    }, [data.date]);

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

        axios.post('/api/elw/archiv', data).then(async () => {
            console.log('success');

            await mutate('/api/elw/statistics');

            setProcessing(false);
            setData({
                ...blankData,
                date: data.date,
                testKitName: data.testKitName,
                locationId: data.locationId,
            });
        }).catch((err) => {
            setError(`Es konnten keine Daten archiviert werden. (${err.response.data?.message || err.response.data?.result})`);

            setProcessing(false);
        });
    }

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [ev.target.name]: ev.target.value });
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
                        </Select>
                    </FormControl>

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Nachname"
                                variant="outlined"
                                margin="normal"
                                value={data.lastName}
                                name="lastName"
                                onChange={onChange}
                                size="small"
                                disabled={isProcessing || locationIndex < 0}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Vorname"
                                variant="outlined"
                                margin="normal"
                                value={data.firstName}
                                name="firstName"
                                onChange={onChange}
                                size="small"
                                disabled={isProcessing || locationIndex < 0}
                            />
                        </Grid>
                    </Grid>

                    <KeyboardDatePicker
                        variant="inline"
                        format="DD.MM.YYYY"
                        margin="normal"
                        label="Geburtstag"
                        inputVariant="outlined"
                        size="small"
                        value={data.birthday}
                        onChange={(date) => setData({ ...data, birthday: date.toDate() })}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        minDate="1910-01-01T11:04:05.573Z"
                        maxDate={new Date()}
                        minDateMessage="Maximales Alter beträgt 110"
                        fullWidth
                        required
                        disabled={isProcessing || locationIndex < 0}
                    />

                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                ampm={false}
                                fullWidth
                                variant="inline"
                                label="Termin"
                                inputVariant="outlined"
                                margin="normal"
                                required
                                size="small"
                                disabled={isProcessing || locationIndex < 0}
                                value={data.date}
                                name="date"
                                onChange={(date) => setData({ ...data, date: date.toDate() })}
                                minutesStep={1}
                                disableFuture={true}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                variant="inline"
                                ampm={false}
                                fullWidth
                                label="Testzeit"
                                inputVariant="outlined"
                                margin="normal"
                                required
                                size="small"
                                disabled={isProcessing || locationIndex < 0}
                                value={data.evaluatedAt}
                                name="evaluatedAt"
                                onChange={(date) => setData({ ...data, evaluatedAt: date.toDate() })}
                                minutesStep={1}
                                disableFuture={true}
                            />
                        </Grid>
                    </Grid>

                    <FormControl variant="outlined" size="small" margin="normal" required fullWidth>
                        <InputLabel id="select-location-label">Ergebnis</InputLabel>
                        <Select
                            labelId="select-location-label"
                            value={data.result}
                            onChange={onChange}
                            name="result"
                            required
                            disabled={isProcessing || locationIndex < 0}
                        >
                            <MenuItem value="negativ">Negativ</MenuItem>
                            <MenuItem value="invalid">Ungültig</MenuItem>
                            <MenuItem value="positiv">Positiv</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        required
                        label="Testname"
                        variant="outlined"
                        margin="normal"
                        value={data.testKitName}
                        name="testKitName"
                        onChange={onChange}
                        size="small"
                        disabled={isProcessing || locationIndex < 0}
                    />

                    <Box mt={1}>
                        <Button fullWidth type="submit" color="primary" variant="contained" disabled={isProcessing || locationIndex < 0}>
                            {isProcessing ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Trage ein</> : 'Eintragen'}
                        </Button>
                    </Box>
                    {error && <Box mt={3}><Alert severity="warning">{error}</Alert></Box>}
                </Box>
            </form>
        </MuiPickersUtilsProvider>
    )
}

export default AddToArchiv;