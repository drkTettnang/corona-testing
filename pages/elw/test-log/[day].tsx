import React from 'react';
import { Box, createStyles, Grid, makeStyles, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { Booking } from '@prisma/client';
import prisma from '../../../lib/prisma';
import TestLog from '../../../components/elw/TestLog';
import { getSession } from 'next-auth/client';
import DataProtectionPaper from '../../../components/DataProtectionPaper';
import { isModerator } from '../../../lib/authorization'
import dayjs from 'dayjs';
import A4Page from '../../../components/layout/A4Page';
import { getMac } from '../../../lib/hmac';
import QRCode from 'qrcode.react';
import 'dayjs/locale/de';

dayjs.locale('de');

const useStyles = makeStyles(() =>
    createStyles({

    }),
)

interface Props {
    bookings: Booking[]
    denied: boolean
    authCode: string
}

const TestLogPage: NextPage<Props> = ({ bookings, denied, authCode }) => {
    if (denied !== false) return <p>Access Denied</p>

    const firstDate = bookings[0].date;

    return (<>
        <A4Page>
            <Grid container justify="center" alignItems="center" style={{height: '100%'}} direction="column">
                <Typography variant="body1" gutterBottom={true}>{dayjs(firstDate).format('dddd, D. MMMM')}</Typography>
                <Typography variant="h4">Anmeldung Teststation</Typography>
                <Typography variant="h6" gutterBottom={true}>ACHTUNG Vertraulich!</Typography>
                <Box m={3}>
                    <QRCode value={authCode} />
                </Box>
                <Typography variant="body1" gutterBottom={true}>{authCode}</Typography>
                <Typography variant="body1">/station</Typography>
            </Grid>
        </A4Page>
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

        if (bookings.length === 0) {
            return {
                notFound: true,
            }
        }

        return {
            props: {
                bookings: JSON.parse(JSON.stringify(bookings)),
                denied: false,
                authCode: getMac(startDate.format('YYYY-MM-DD'), ':station'),
            }, // will be passed to the page component as props
        }
    }

    return {
        props: {
            bookings: [],
            denied: true,
        }
    }
}