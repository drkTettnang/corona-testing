import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { NextPage } from 'next';
import { Booking } from '@prisma/client';
import prisma from '../../lib/prisma';
import TestLog from '../../components/TestLog';
import { getSession, useSession } from 'next-auth/client';
import DataProtectionPaper from '../../components/DataProtectionPaper';

const useStyles = makeStyles(() =>
    createStyles({

    }),
)

interface Props {
    bookings: Booking[]
    denied: boolean
}

const TestLogPage: NextPage<Props> = ({ bookings, denied }) => {
    if (denied) return <p>Access Denied</p>

    return (<>
        {bookings.map(booking => <div key={booking.id}>
            <TestLog  booking={booking} />
            <DataProtectionPaper />
        </div>)}
    </>)
}

export default TestLogPage;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session && process.env.MODERATORS && process.env.MODERATORS.split(',').includes(session.user?.email)) {
        const bookings = await prisma.booking.findMany({
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    email: 'asc',
                }
            ]
        });

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