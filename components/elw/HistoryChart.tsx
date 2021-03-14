import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }),
)

type Props = {
    bookings: { count: number, createdAt: string }[],
    occupiedSlots: { count: number, date: string }[],
    availableSlots: { count: number, date: string }[],
}

const HistoryChart: React.FC<Props> = ({ bookings, occupiedSlots, availableSlots }) => {
    const classes = useStyles();

    if (bookings.length === 0 && occupiedSlots.length === 0 && availableSlots.length === 0) {
        return;
    }

    const options = {
        chart: {
            id: 'foo',
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#FEB019', '#008000', '#f44336'],
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            type: 'datetime'
        },
        yaxis: {
            tickAmount: 3,
            min: 0,
            max: (maxValue) => Math.ceil(maxValue * 1.05),
        },
        markers: {
            size: 6,
        },
        legend: {
            floating: true,
            position: 'top',
            horizontalAlign: 'left',
        },
        tooltip: {
            enabled: true,
            shared: true,
        }
    }

    const minTime = Math.min(
        bookings.length > 0 ? (new Date(bookings[bookings.length - 1].createdAt)).getTime() : Number.MAX_SAFE_INTEGER,
        availableSlots.length > 0 ? (new Date(availableSlots[availableSlots.length - 1].date)).getTime() : Number.MAX_SAFE_INTEGER,
        occupiedSlots.length > 0 ? (new Date(occupiedSlots[occupiedSlots.length - 1].date)).getTime() : Number.MAX_SAFE_INTEGER
    );

    const maxTime = Math.max(
        bookings.length > 0 ? (new Date(bookings[0].createdAt)).getTime() : 0,
        availableSlots.length > 0 ? (new Date(availableSlots[0].date)).getTime() : 0,
        occupiedSlots.length > 0 ? (new Date(occupiedSlots[0].date)).getTime() : 0
    );

    const minDate = dayjs(minTime);
    const maxDate = dayjs(maxTime);
    const blanko: [string, number][] = [];

    for (let i = 0; i <= maxDate.diff(minDate, 'day'); i++) {
        blanko.push([minDate.add(i, 'day').format('YYYY-MM-DD'), 0]);
    }

    const bookingData = JSON.parse(JSON.stringify(blanko));;

    bookings.forEach(entry => {
        const index = dayjs(entry.createdAt).diff(minDate, 'day');

        bookingData[index][1] = entry.count;
    });

    const availableData = JSON.parse(JSON.stringify(blanko));

    availableSlots.forEach(entry => {
        const index = dayjs(entry.date).diff(minDate, 'day');

        availableData[index][1] = entry.count;
    });

    const occupiedData = JSON.parse(JSON.stringify(blanko));

    occupiedSlots.forEach(entry => {
        const index = dayjs(entry.date).diff(minDate, 'day');

        occupiedData[index][1] = entry.count;
    });

    const series = [{
        name: 'Buchungstag',
        data: bookingData,
        type: 'line',
    }, {
        name: 'verfügbar',
        data: availableData,
        type: 'column',
    }, {
        name: 'belegt',
        data: occupiedData,
        type: 'column',
    },];

    console.log(series)

    return (
        <Paper>
            <Chart options={options} series={series} height={300} type="line" />
        </Paper>
    )
}

export default HistoryChart;