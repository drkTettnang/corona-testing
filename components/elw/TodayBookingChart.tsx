import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Config from '../../lib/Config';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    today: { date: string, createdAt: string }[]
}

const TodayBookingChart: React.FC<Props> = ({ today }) => {
    const classes = useStyles();

    const options = {
        chart: {
            height: 300,
            type: 'bubble' as const,
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
        },
        tooltip: {
            enabled: false,
        },
        fill: {
            opacity: 0.6,
        },
        colors: ['#FEB019', '#008000', '#f44336'],
        xaxis: {
            min: 0,
            max: 24,
            tickAmount: 24,
        },
        yaxis: {
            tickAmount: Math.min(7, Config.MAX_DAYS),
            max: Config.MAX_DAYS + 1,
            min: 0,
            decimalsInFloat: 0,
        }
    };

    const midnight = dayjs().hour(0).minute(0).second(0).millisecond(0);

    const series = [{
        data: today.reduce((values, t) => {
            if (values.length > 0 && values[values.length - 1].date === t.date) {
                values[values.length - 1].count++;
                return values;
            }

            values.push({ ...t, count: 1 });

            return values;
        }, []).map(t => {
            return [dayjs(t.createdAt).diff(midnight, 'minutes') / 60, dayjs(t.date).diff(t.createdAt, 'hours') / 24, t.count];
        }),
    }];

    return (
        <Paper>
            <ReactApexChart options={options} series={series} type="scatter" height={300} />
        </Paper>
    )
}

export default TodayBookingChart;