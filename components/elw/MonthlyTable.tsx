import React, { useMemo, useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, FormControl, InputLabel, MenuItem, Select, Grid, Typography } from '@material-ui/core';
import { stringify } from "querystring";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            '& th': {
                fontWeight: 'bold',
            }
        },
        year: {
            fontSize: '0.8em',
        },
    }),
)

type Props = {
    locations: {
        [id: number]: string,
    },
    months: {
        location_id: number,
        year: number,
        month: number,
        age: number,
        stdAge: number,
        count: number,
        positiv: number,
        invalid: number,
        negativ: number,
        unknown: number,
        canceled: number,
    }[],
}

const MonthlyTable: React.FC<Props> = ({ months, locations }) => {
    const classes = useStyles();
    const [numberOfLastMonth, setNumberOfLastMonth] = useState(2);
    const aggregated = {
        count: 0,
        positiv: 0,
        invalid: 0,
        negativ: 0,
        unknown: 0,
        canceled: 0,
    };

    const yearMonthCount = useMemo(() => months.reduce<{ yearMonth: string, count: number }[]>((list, month) => {
        const yearMonth = `${month.year}-${month.month}`;

        if (list.length === 0) {
            return [{
                yearMonth,
                count: 1,
            }];
        }

        if (list[list.length - 1].yearMonth === yearMonth) {
            const copy = [...list];

            copy[copy.length - 1].count++;

            return copy;
        }

        return [
            ...list,
            {
                yearMonth,
                count: 1,
            }
        ]
    }, []), months);

    console.log({yearMonthCount});

    const numberOfSelectedRows = numberOfLastMonth > 0 ? yearMonthCount.slice(-1 * numberOfLastMonth).reduce<number>((count, yearMonth) => count + yearMonth.count, 0) : -1;

    console.log({numberOfSelectedRows})

    const selectedMonth = numberOfLastMonth > 0 ? months.slice(-1 * numberOfSelectedRows) : months;

    console.log({selectedMonth})

    selectedMonth.forEach(month => {
        aggregated.count += month.count;
        aggregated.positiv += month.positiv;
        aggregated.invalid += month.invalid;
        aggregated.negativ += month.negativ;
        aggregated.unknown += month.unknown;
        aggregated.canceled += month.canceled;
    });

    const aggregatedTestedCount = aggregated.positiv + aggregated.invalid + aggregated.negativ;

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead className={classes.header}>
                        <TableRow>
                            <TableCell>Ort</TableCell>
                            <TableCell>Monat</TableCell>
                            <TableCell>Anzahl</TableCell>
                            <TableCell>Positiv</TableCell>
                            <TableCell>Ungültig</TableCell>
                            <TableCell>Negativ</TableCell>
                            <TableCell>Unbekannt</TableCell>
                            <TableCell>Storniert</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedMonth.map(month => {
                            const testedCount = month.positiv + month.invalid + month.negativ;
                            return (
                                <TableRow key={`${month.location_id}-${month.year}-${month.month}`}>
                                    <TableCell>{locations[month.location_id] || month.location_id}</TableCell>
                                    <TableCell><span className={classes.year}>{month.year}.</span>{month.month}</TableCell>
                                    <TableCell>{month.count} <em>({testedCount})</em></TableCell>
                                    <TableCell>{month.positiv} {testedCount > 0 && <em>({(month.positiv / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                    <TableCell>{month.invalid} {testedCount > 0 && <em>({(month.invalid / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                    <TableCell>{month.negativ} {testedCount > 0 && <em>({(month.negativ / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                    <TableCell>{month.unknown} <em>({(month.unknown / month.count * 100).toFixed(2)}%)</em></TableCell>
                                    <TableCell>{month.canceled} <em>({(month.canceled / month.count * 100).toFixed(2)}%)</em></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>{aggregated.count} <em>({aggregatedTestedCount})</em></TableCell>
                            <TableCell>{aggregated.positiv} {aggregatedTestedCount > 0 && <em>({(aggregated.positiv / aggregatedTestedCount * 100).toFixed(2)}%)</em>}</TableCell>
                            <TableCell>{aggregated.invalid} {aggregatedTestedCount > 0 && <em>({(aggregated.invalid / aggregatedTestedCount * 100).toFixed(2)}%)</em>}</TableCell>
                            <TableCell>{aggregated.negativ} {aggregatedTestedCount > 0 && <em>({(aggregated.negativ / aggregatedTestedCount * 100).toFixed(2)}%)</em>}</TableCell>
                            <TableCell>{aggregated.unknown} <em>({(aggregated.unknown / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                            <TableCell>{aggregated.canceled} <em>({(aggregated.canceled / aggregated.count * 100).toFixed(2)}%)</em></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Grid container justify="flex-end" alignItems="center" spacing={3}>
                <Grid item>
                    <Typography variant="caption" color="textSecondary">{selectedMonth.length} von {months.length} Monate werden angezeigt.</Typography>
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" size="small" margin="normal">
                        <InputLabel id="select-location-label">Zeige</InputLabel>
                        <Select
                            labelId="select-location-label"
                            value={numberOfLastMonth}
                            onChange={(ev) => setNumberOfLastMonth(parseInt(ev.target.value.toString(), 10))}
                            required
                        >
                            <MenuItem value="1">1 Monat</MenuItem>
                            <MenuItem value="2">2 Monate</MenuItem>
                            <MenuItem value="4">4 Monate</MenuItem>
                            <MenuItem value="0">Alle</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    )
}

export default MonthlyTable;