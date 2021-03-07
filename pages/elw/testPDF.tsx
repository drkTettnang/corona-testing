import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import puppeteer from 'puppeteer';
import { getSession } from 'next-auth/client';
import { isModerator } from '../../lib/authorization';


interface Props {
    errorMessage?: string
}

const TestPDF: NextPage<Props> = ({ errorMessage }) => {
    return <>{errorMessage}</>;
}

export default TestPDF;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (isModerator(session)) {
        const url = (process.env.NEXTAUTH_URL.endsWith('/') ? process.env.NEXTAUTH_URL : process.env.NEXTAUTH_URL + '/');

        let pdf: Buffer;

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(url, { waitUntil: 'networkidle0' });
            pdf = await page.pdf({
                format: 'a4',
                margin: {
                    top: '1.2cm',
                    right: '1.2cm',
                    bottom: '1.8cm',
                    left: '1.2cm',
                },
            });
            await browser.close();
        } catch (error) {
            return {
                props: {
                    errorMessage: error.toString(),
                },
            }
        }

        context.res.setHeader('Content-disposition', `attachment; filename="test.pdf"`);
        context.res.setHeader('Content-Type', 'application/pdf');
        context.res.setHeader('Content-Length', Buffer.byteLength(pdf));

        context.res.end(pdf);

        return {
            props: {},
        }
    }

    return {
        notFound: true
    }
}
