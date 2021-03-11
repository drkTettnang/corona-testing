import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Chart, PieSeries, Title, Legend } from '@devexpress/dx-react-chart-material-ui';
import { Animation, Palette } from '@devexpress/dx-react-chart';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import { blue, green, grey, red } from '@material-ui/core/colors';
import { Box, Typography } from '@material-ui/core';

dayjs.locale('de');

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        label: {
            fontSize: '0.8em',
        }
    }),
)

type Props = {
    date: Date,
    results: { unknown?: number, invalid?: number, positiv?: number, negativ?: number },
}

const resultTranslation = {
    invalid: 'ungültig',
    unknown: 'unbekannt',
    positiv: 'positiv',
    negativ: 'negativ',
  };

const EvaluationChart: React.FC<Props> = ({ date, results }) => {
    const classes = useStyles();

    const data = Object.keys(results).sort().map(result => {
        return {
            result,
            count: results[result],
        };
    });

    return (
        <Paper>
            <Box display="flex">
                <Chart data={data} width={100} height={100}>
                    <Palette scheme={[grey[500], green[500], red[500], blue[200]]} />
                    <PieSeries
                        valueField="count"
                        argumentField="result"
                        innerRadius={0.6}
                    />
                    <Animation />
                </Chart>
                <Box flexGrow={1} padding="10px">
                    <Typography className={classes.label} variant="body2"><strong>{dayjs(date).format('dddd, D. MMMM')}</strong></Typography>
                    {data.map((d, i) => <Typography key={i} className={classes.label} variant="body2">{d.count} {resultTranslation[d.result]}</Typography>)}
                </Box>
            </Box>
        </Paper>
    )
}

export default EvaluationChart;