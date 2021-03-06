import ical from 'ical-generator';

export default function generateIcal(start: Date, end: Date, summary: string, description: string, location: string, organizer: {name: string, email: string}) {
    const cal = ical({
        domain: 'drk-tettnang.de',
        name: 'Corona Schnelltest'
    });

    cal.createEvent({
        start,
        end,
        summary,
        description,
        location,
        organizer,
    });

    return cal;
}