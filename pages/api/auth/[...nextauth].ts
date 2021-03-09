import { NextApiHandler } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";
import { sendVerificationRequest } from "../../../lib/email";

const options: InitOptions = {
    providers: [
        // Providers.GitHub ...
        Providers.Email({
            server: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            from: process.env.SMTP_FROM, // The "from" address that you want to use
            sendVerificationRequest,
        }),
    ],
    adapter: Adapters.Prisma.Adapter({ prisma }),
    secret: process.env.SECRET,
    session: {
        maxAge: 2 * 24 * 60 * 60,
    },
    pages: {
        verifyRequest: '/verify-request',
    }
};

// we will define `options` up next
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;