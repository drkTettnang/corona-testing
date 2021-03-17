import React, { useEffect, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { SlotInfo, useLocations } from '../lib/swr';
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import Axios from 'axios';
import { mutate } from 'swr';
import { useRouter } from 'next/router';
import Alert from '@material-ui/lab/Alert';
import { RESERVATION_DURATION } from '../lib/const';
import Config from '../lib/Config';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import SlotCalendar from './SlotCalendar';
import { Location } from '@prisma/client';

dayjs.locale('de');

function sendReservation(slotId: number, numberOfAdults: number, numberOfChildren: number, code: string) {
    return Axios.put('/api/reserve', {
        slotId,
        numberOfAdults,
        numberOfChildren,
        code,
    }).then(async response => {
        console.log('success', response.data);

        await mutate('/api/reservations');
    })
}

function verifyCode(slotId: number, code: string): Promise<boolean> {
    return Axios.post('/api/verify', {
        slotId,
        code,
    }).then(response => {
        return response.data?.result === 'valid';
    }).catch((err) => {
        console.warn('Could not verify code', err);

        return false;
    });
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: '160px',
        },
        code: {
            width: 160,
            marginRight: theme.spacing(3),
        }
    }),
)

type Props = {

}

const DateSelection: React.FC<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<Location>();
    const { locations, isLoading: locationsAreLoading } = useLocations();
    const [selectedSlot, setSelectedSlot] = useState<SlotInfo>();
    const [isReserving, setIsReserving] = useState<boolean>(false);
    const [numberOfAdults, setNumberOfAdults] = useState<number>(0);
    const [numberOfChildren, setNumberOfChildren] = useState<number>(0);
    const [code, setCode] = useState('');

    useEffect(() => {
        setSelectedSlot(undefined);
    }, [numberOfAdults, numberOfChildren, selectedLocation]);

    useEffect(() => {
        setCode('');
    }, [selectedSlot]);

    const reserve = async () => {
        setIsReserving(true);

        if (selectedSlot.requireCode && !(await verifyCode(selectedSlot.id, code))) {
            setError('Code ist ungültig');
            setIsReserving(false);

            return;
        }

        try {
            await sendReservation(selectedSlot.id, numberOfAdults, numberOfChildren, code);

            router.push('/application');
        } catch (err) {
            setError(`Es ist ein Fehler aufgetreten. (${err.response?.data?.result || err})`);
        }
    }

    const onLocationChange = (ev: React.ChangeEvent<{ name: string, value: string }>) => {
        const index = parseInt(ev.target.value, 10);

        setSelectedLocation(index >= 0 ? locations[index] : undefined);
    }

    // const availableDates = (groupedDates && Object.keys(groupedDates).length > 0) ?
    //     Object.values(groupedDates).reduce((sum, i) => (sum + (i.stats.seats - i.stats.occupied)), 0)
    //     :
    //     -1;

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                    <Typography variant="body1">Sie können einen Termin für bis zu {Config.MAX_ADULTS} Erwachsenen und {Config.MAX_CHILDREN} ihrer Kinder (unter 18 Jahren)
                        vereinbaren. Beachten Sie, dass Kinder nur in Begleitung eines Erziehungsberichtigten getestet werden können.</Typography>

                    <Box mt={3} mb={3}>
                        {locationsAreLoading ?
                            <CircularProgress />
                            :
                            <>
                                {locations.length === 0 && <Alert severity="warning">Zur Zeit stehen keine Termine zur Verfügung.</Alert>}

                                <Box mr={6}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="select-location-label">Ort</InputLabel>
                                        <Select
                                            labelId="select-location-label"
                                            value={selectedLocation ? locations.indexOf(selectedLocation) : -1}
                                            onChange={onLocationChange}
                                        >
                                            <MenuItem value="-1"><em>Bitte wählen</em></MenuItem>
                                            {locations.map((location, index) => <MenuItem key={location.id} value={index}>{location.name}, {location.address}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <FormControl className={classes.formControl}>
                                    <InputLabel id="number-adults-label">Anzahl Erwachsener</InputLabel>
                                    <Select
                                        labelId="number-adults-label"
                                        id="number-adults-label"
                                        value={numberOfAdults}
                                        disabled={!selectedLocation}
                                        onChange={ev => setNumberOfAdults(parseInt(ev.target.value as string, 10))}
                                    >
                                        {Array.from({ length: Config.MAX_ADULTS + 1 }, (_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="number-children-label">Anzahl Minderjähriger</InputLabel>
                                    <Select
                                        labelId="number-children-label"
                                        id="number-children-label"
                                        value={numberOfChildren}
                                        disabled={!selectedLocation}
                                        // disabled={numberOfAdults === 0}
                                        onChange={ev => setNumberOfChildren(parseInt(ev.target.value as string, 10))}
                                    >
                                        {Array.from({ length: Config.MAX_CHILDREN + 1 }, (_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </>}
                    </Box>

                    {(numberOfAdults + numberOfChildren) > Config.MAX_GROUP && <Alert severity="error">Es kann maximal ein Termin für {Config.MAX_GROUP} Person(en) erstellt werden.</Alert>}

                    {((numberOfAdults + numberOfChildren) > 0 && (numberOfAdults + numberOfChildren) <= Config.MAX_GROUP) && (
                        !selectedSlot ?
                            <Typography variant="body1">Bitte wählen Sie eine Örtlichkeit und Uhrzeit aus.</Typography>
                            :
                            <>
                                <Typography variant="body1">Sie haben den Termin am <strong>{(new Date(selectedSlot.date)).toLocaleString()}</strong> ausgewählt.</Typography>
                                <Box m={2}>
                                    {selectedSlot.requireCode &&
                                        <TextField
                                            label="Code"
                                            variant="outlined"
                                            value={code}
                                            onChange={ev => setCode(ev.target.value)}
                                            size="small"
                                            disabled={isReserving}
                                            className={classes.code}
                                        />}
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => reserve()}
                                        disabled={isReserving || (selectedSlot.requireCode && !code)}
                                    >{isReserving ? <><CircularProgress size="1em" color="inherit" />&nbsp;&nbsp;Reserviere Termin</> : 'Zur Anmeldung'}</Button>
                                </Box>
                                <Typography variant="body2">Bitte füllen Sie die Anmeldung innerhalb von {RESERVATION_DURATION} Minuten aus, ansonsten kann dieser Termin anderen Personen zur Verfügung stehen.</Typography>

                                <Box m={3}>
                                    {error && <Alert severity="error">{error}</Alert>}
                                </Box>
                            </>
                    )}

                    {false && <Alert severity="info"><strong>Alle Plätze reserviert!</strong> Bitte nehmen Sie von einem Erscheinen ohne
                    Anmeldung Abstand, da wir nur über begrenzte Ressourcen verfügen und daher nur Personen mit Terminreservierung testen können.</Alert>}
                </Grid>
                <Grid item md={6} xs={12}>
                    {(numberOfAdults > 0 || numberOfChildren > 0) && selectedLocation &&
                        <SlotCalendar
                            isReserving={isReserving}
                            location={selectedLocation}
                            numberOfAdults={numberOfAdults}
                            numberOfChildren={numberOfChildren}
                            selectedSlot={selectedSlot}
                            setSelectedSlot={setSelectedSlot} />
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default DateSelection;