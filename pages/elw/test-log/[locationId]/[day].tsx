import React from 'react';
import { Box, createStyles, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { Booking, Location } from '@prisma/client';
import prisma from '../../../../lib/prisma';
import TestLog from '../../../../components/elw/TestLog';
import { getSession } from 'next-auth/client';
import DataProtectionPaper from '../../../../components/DataProtectionPaper';
import { isModerator } from '../../../../lib/authorization'
import dayjs from 'dayjs';
import A4Page from '../../../../components/layout/A4Page';
import { getMac } from '../../../../lib/hmac';
import QRCode from 'qrcode.react';
import 'dayjs/locale/de';
import { generatePublicId, getAbsoluteUrl } from '../../../../lib/helper';
import Head from 'next/head';
import Config from '../../../../lib/Config';
import WarningIcon from '@material-ui/icons/WarningOutlined';

dayjs.locale('de');

const useStyles = makeStyles(() =>
    createStyles({

    }),
)

interface Props {
    location: Location
    bookings: Booking[]
    denied: boolean
    authCode: string
    url: string
    urlPrint: string
}

const TestLogPage: NextPage<Props> = ({ location, bookings, denied, authCode, url, urlPrint }) => {
    if (denied !== false) return <p>Access Denied</p>

    if (bookings.length === 0) {
        return <>Keine Buchungen an diesem Tag</>;
    }

    const firstDate = bookings[0].date;

    const maxId = bookings.reduce((currentMax, booking) => {
        return Math.max(currentMax, booking.id);
    }, 0);

    if (!Config.IS_TESTING) {
        return (<>
            <Head>
                <title>Anmeldungen - {dayjs(firstDate).format('YYYY-MM-DD')}</title>
            </Head>
            <A4Page>
                <Grid container justify="center" alignItems="center" style={{ height: '100%' }} direction="column">
                    <Typography variant="body1">{dayjs(firstDate).format('dddd, D. MMMM')}</Typography>
                    <Typography variant="body1" gutterBottom={true}>{location.address}</Typography>
                    <Typography variant="h4">Anmeldungen</Typography>
                    <Typography variant="h6" gutterBottom={true}>ACHTUNG Vertraulich!</Typography>

                    <Box m={3}>
                        <Typography variant="body1" gutterBottom={true}>Letzte Buchungsnummer: {generatePublicId(maxId)}</Typography>
                        <Typography variant="body1" gutterBottom={true}>Kurzfristige Anmeldung? <strong>{location.rollingBooking ? 'Ja' : 'Nein'}</strong></Typography>
                    </Box>
                </Grid>
            </A4Page>
            <A4Page>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Geburtstag</TableCell>
                                <TableCell>Termin</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking, index) => <TableRow key={booking.id} style={{backgroundColor: index % 2 ? '#fff' : '#f1f1f1'}}>
                                <TableCell>{generatePublicId(booking.id)}</TableCell>
                                <TableCell style={{width: '1em'}}><div style={{border: '1px solid black', width: '1em', height: '1em',}}></div></TableCell>
                                <TableCell><strong>{booking.lastName}</strong>, {booking.firstName}</TableCell>
                                <TableCell>{booking.birthday && (new Date(booking.birthday)).toLocaleDateString('de-DE')}{dayjs().diff(booking.birthday, 'year') < 18 && <WarningIcon style={{fontSize: '1em', marginLeft: '0.5em'}} />}</TableCell>
                                <TableCell>{(new Date(booking.date)).toLocaleTimeString('de-DE', { minute: 'numeric', hour: 'numeric' })}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </A4Page>
        </>);
    }

    const blankoBooking: Booking = {
        id: 0,
        email: '',
        date: undefined,
        firstName: '',
        lastName: '',
        street: '',
        postcode: '',
        city: '',
        birthday: undefined,
        phone: '',
        createdAt: undefined,
    } as any;

    return (<>
        <Head>
            <title>Einverständniserklärungen - {dayjs(firstDate).format('YYYY-MM-DD')}</title>
        </Head>
        <A4Page>
            <Grid container justify="center" alignItems="center" style={{ height: '100%' }} direction="column">
                <Typography variant="body1">{dayjs(firstDate).format('dddd, D. MMMM')}</Typography>
                <Typography variant="body1" gutterBottom={true}>{location.address}</Typography>
                <Typography variant="h4">Anmeldung Teststation</Typography>
                <Typography variant="h6" gutterBottom={true}>ACHTUNG Vertraulich!</Typography>
                <Box m={3}>
                    <QRCode value={authCode} />
                </Box>
                <Typography variant="body1" gutterBottom={true}>{authCode}</Typography>
                <Typography variant="body1">{url}</Typography>
                <Box m={3}>
                    <Typography variant="body1" gutterBottom={true}>Letzte Buchungsnummer: {generatePublicId(maxId)}</Typography>
                    <Typography variant="body1" gutterBottom={true}>Kurzfristige Anmeldung? <strong>{location.rollingBooking ? 'Ja' : 'Nein'}</strong></Typography>
                    {location.rollingBooking && <Typography variant="body1">{urlPrint}</Typography>}
                </Box>
            </Grid>
        </A4Page>
        <A4Page></A4Page>
        {bookings.map(booking => <div key={booking.id}>
            <TestLog location={location} booking={booking} />
            <DataProtectionPaper />
        </div>)}
        <TestLog location={location} booking={blankoBooking} />
        <DataProtectionPaper />
    </>)
}

export default TestLogPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const day = context.params.day?.toString() || '';
    const locationId = parseInt(context.params.locationId.toString(), 10);

    if (!(/^\d{4}-\d{2}-\d{2}$/.test(day)) || isNaN(locationId) || locationId <= 0) {
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
                },
                slot: {
                    locationId,
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

        const location = await prisma.location.findUnique({
            where: {
                id: locationId,
            },
        });

        if (!Config.IS_TESTING) {
            return {
                props: {
                    location,
                    bookings: JSON.parse(JSON.stringify(bookings)),
                    denied: false,
                }
            };
        }

        return {
            props: {
                location,
                bookings: JSON.parse(JSON.stringify(bookings)),
                denied: false,
                authCode: bookings.length > 0 ? locationId + ':' + getMac(locationId + ':' + startDate.format('YYYY-MM-DD'), ':station') : '',
                url: getAbsoluteUrl('/station'),
                urlPrint: getAbsoluteUrl('/print'),
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