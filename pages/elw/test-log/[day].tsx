import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { Booking } from '@prisma/client';
import prisma from '../../../lib/prisma';
import TestLog from '../../../components/elw/TestLog';
import { getSession } from 'next-auth/client';
import DataProtectionPaper from '../../../components/DataProtectionPaper';
import { isModerator } from '../../../lib/authorization'
import dayjs from 'dayjs';

const useStyles = makeStyles(() =>
    createStyles({

    }),
)

interface Props {
    bookings: Booking[]
    denied: boolean
}

const TestLogPage: NextPage<Props> = ({ bookings, denied }) => {
    if (denied !== false) return <p>Access Denied</p>

    return (<>
        {bookings.map(booking => <div key={booking.id}>
            <TestLog booking={booking} />
            <DataProtectionPaper />
        </div>)}
    </>)
}

export default TestLogPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const day = context.params.day?.toString() || '';

    if (!(/^\d{4}-\d{2}-\d{2}$/.test(day))) {
        return {
            notFound: true,
        }
    }

    const startDate = dayjs(day, 'YYYY-MM-DD');
    const endDate = startDate.add(1, 'day');

    if (isModerator(session)) {
        const bookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startDate.toDate(),
                    lt: endDate.toDate(),
                }
            },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    email: 'asc',
                }
            ]
        });

        console.log({ bookings })

        if (bookings.length === 0) {
            return {
                notFound: true,
            }
        }

        return {
            props: { bookings: JSON.parse(JSON.stringify(bookings)), denied: false }, // will be passed to the page component as props
        }
    }

    return {
        props: {
            bookings: [],
            denied: true,
        }
    }
}