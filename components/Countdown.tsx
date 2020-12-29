import React, { Component } from 'react';

export default class Countdown extends Component<{ date: string }, {minutes: number, seconds: number}> {
    private interval;

    constructor(props) {
        super(props);

        this.state = {
            minutes: 0,
            seconds: 0,
        }
    }

    componentDidMount() {
        // update every second
        this.interval = setInterval(() => {
            this.calculateCountdown(this.props.date);
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    calculateCountdown(endDate) {
        endDate = new Date(endDate);
        let currentDate = new Date();
        let diff = (endDate.getTime() - currentDate.getTime()) / 1000;

        let minutes = diff < 0 ? -1 : Math.floor(diff / 60);
        let seconds = diff < 0 ? -1 : Math.floor(diff) % 60;

        // check rerendering
        // if (diff < 0) {
        //     this.stop();
        // }

        this.setState({
            minutes,
            seconds,
        });
    }

    stop() {
        clearInterval(this.interval);
    }

    addLeadingZeros(value) {
        value = String(value);

        while (value.length < 2) {
            value = '0' + value;
        }

        return value;
    }

    render() {
        let { minutes, seconds } = this.state;

        if (minutes < 0 || seconds < 0) {
            return (
                <span>Überfällig</span>
            );
        }

        return (
            <span>{this.addLeadingZeros(minutes)}:{this.addLeadingZeros(seconds)}</span>
        );
    }
}