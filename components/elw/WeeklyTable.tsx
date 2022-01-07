import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, FormControl, InputLabel, MenuItem, Select, Grid, Typography } from '@material-ui/core';

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
    weeks: {
        yearweek: number,
        year: number,
        week: number,
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

const WeeklyTable: React.FC<Props> = ({ weeks }) => {
    const classes = useStyles();
    const [numberOfLastWeeks, setNumberOfLastWeeks] = useState(4);
    const aggregated = {
        count: 0,
        positiv: 0,
        invalid: 0,
        negativ: 0,
        unknown: 0,
        canceled: 0,
    };

    const selectedWeeks = numberOfLastWeeks > 0 ? weeks.slice(-1 * numberOfLastWeeks) : weeks;

    selectedWeeks.forEach(week => {
        aggregated.count += week.count;
        aggregated.positiv += week.positiv;
        aggregated.invalid += week.invalid;
        aggregated.negativ += week.negativ;
        aggregated.unknown += week.unknown;
        aggregated.canceled += week.canceled;
    });

    const aggregatedTestedCount = aggregated.positiv + aggregated.invalid + aggregated.negativ;

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead className={classes.header}>
                        <TableRow>
                            <TableCell>Woche</TableCell>
                            <TableCell>Anzahl</TableCell>
                            <TableCell>Positiv</TableCell>
                            <TableCell>Ungültig</TableCell>
                            <TableCell>Negativ</TableCell>
                            <TableCell>Unbekannt</TableCell>
                            <TableCell>Storniert</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedWeeks.map(week => {
                            const testedCount = week.positiv + week.invalid + week.negativ;
                            return (
                                <TableRow key={week.week}>
                                    <TableCell><span className={classes.year}>{week.year}.</span>{week.week}</TableCell>
                                    <TableCell>{week.count} <em>({testedCount})</em></TableCell>
                                    <TableCell>{week.positiv} {testedCount > 0 && <em>({(week.positiv / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                    <TableCell>{week.invalid} {testedCount > 0 && <em>({(week.invalid / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                    <TableCell>{week.negativ} {testedCount > 0 && <em>({(week.negativ / testedCount * 100).toFixed(2)}%)</em>}</TableCell>
                                    <TableCell>{week.unknown} <em>({(week.unknown / week.count * 100).toFixed(2)}%)</em></TableCell>
                                    <TableCell>{week.canceled} <em>({(week.canceled / week.count * 100).toFixed(2)}%)</em></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
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
                    <Typography variant="caption" color="textSecondary">{selectedWeeks.length} von {weeks.length} Wochen werden angezeigt.</Typography>
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" size="small" margin="normal">
                        <InputLabel id="select-location-label">Zeige</InputLabel>
                        <Select
                            labelId="select-location-label"
                            value={numberOfLastWeeks}
                            onChange={(ev) => setNumberOfLastWeeks(parseInt(ev.target.value.toString(), 10))}
                            required
                        >
                            <MenuItem value="4">4 Wochen</MenuItem>
                            <MenuItem value="8">8 Wochen</MenuItem>
                            <MenuItem value="0">Alle</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    )
}

export default WeeklyTable;