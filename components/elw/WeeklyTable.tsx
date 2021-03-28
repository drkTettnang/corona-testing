import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            '& th': {
                fontWeight: 'bold',
            }
        },
    }),
)

type Props = {
    weeks: {
        week: number,
        age: number,
        stdAge: number,
        count: number,
        positiv: number,
        invalid: number,
        negativ: number,
        unknown: number,
    }[]
}

const WeeklyTable: React.FC<Props> = ({ weeks }) => {
    const classes = useStyles();

    return (
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
                        <TableCell>Alter</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeks.map(week => {
                        return (
                            <TableRow>
                                <TableCell>{week.week}</TableCell>
                                <TableCell>{week.count} <em>({week.positiv + week.invalid + week.negativ})</em></TableCell>
                                <TableCell>{week.positiv} <em>({(week.positiv / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.invalid} <em>({(week.invalid / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.negativ} <em>({(week.negativ / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.unknown} <em>({(week.unknown / week.count * 100).toFixed(2)}%)</em></TableCell>
                                <TableCell>{week.age.toFixed(2)} <em>({week.stdAge.toFixed(2)})</em></TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default WeeklyTable;