import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import prisma from '../../lib/prisma';
import { verifyMac } from '../../lib/hmac';
import { Booking } from '@prisma/client';
import CertificatePrint from '../../components/certificate/CertificatePrint';
import CertificateHTML from '../../components/certificate/CertificateHTML';
import puppeteer from 'puppeteer';
import contentDisposition from 'content-disposition';
import { sleep } from '../../lib/helper';

const useStyles = makeStyles((theme) =>
    createStyles({

    }),
)

interface Props {
    format: 'pdf' | 'print' | 'html',
    booking: Booking,
    url: string
}

const Certificate: NextPage<Props> = ({ format, booking, url }) => {
    if (format === 'print') {
        return <CertificatePrint booking={booking} url={url} />;
    }

    if (format === 'pdf') {
        return <></>;
    }

    return <CertificateHTML booking={booking} />;
}

export default Certificate;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const uid = context.params.uid?.toString() || '';
    const matches = uid.match(/^([a-z0-9]{40})-(\d+)(?:\.(pdf|print))?$/i);

    if (!matches) {
        return {
            notFound: true,
        }
    }

    const mac = matches[1];
    const id = parseInt(matches[2], 10);
    const format = matches[3] || 'html';

    if (!verifyMac(id.toString(), mac)) {
        // brute force throttle
        await sleep(3);

        return {
            notFound: true,
        };
    }

    const booking = await prisma.booking.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            street: true,
            postcode: true,
            city: true,
            birthday: true,
            phone: true,
            result: true,
            personalA: true,
            evaluatedAt: true,
            testKitName: true,
        }
    });

    if (!booking || !['positiv', 'negativ'].includes(booking.result)) {
        return {
            notFound: true,
        }
    }

    const url = (process.env.NEXTAUTH_URL.endsWith('/') ? process.env.NEXTAUTH_URL : process.env.NEXTAUTH_URL + '/') + `certificate/${mac}-${id}`;

    if (format === 'pdf') {
        let browser: puppeteer.Browser;

        try {
            browser = await puppeteer.launch({
                timeout: 15000,
            });
            const page = await browser.newPage();

            await page.goto(url + '.print', {
                waitUntil: process.env.NODE_ENV === 'production' ? 'networkidle0' : 'networkidle2',
            });
            const pdf = await page.pdf({
                format: 'a4',
                margin: {
                    top: '1.2cm',
                    right: '1.2cm',
                    bottom: '1.8cm',
                    left: '1.2cm',
                },
            });
            await browser.close();

            const filename = `Bescheinigung SARS-CoV-2 Antigentests - ${booking.firstName} ${booking.lastName}.pdf`;

            context.res.setHeader('Content-disposition', contentDisposition(filename));
            context.res.setHeader('Content-Type', 'application/pdf');
            context.res.setHeader('Content-Length', Buffer.byteLength(pdf));

            context.res.end(pdf);
        } catch (err) {
            console.log('Error while creating PDF', err);

            if (browser) {
                await browser.close();
            }

            return {
                props: {
                    format: 'print',
                    booking: JSON.parse(JSON.stringify(booking)),
                    url,
                }
            };
        }

        return {
            props: {
                format,
            }
        };
    }

    return {
        props: {
            format,
            booking: JSON.parse(JSON.stringify(booking)),
            url,
        }
    };
}

