import { NextApiHandler } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";
import { sendVerificationRequest } from "../../../lib/email/verificationRequest";
import { Role, User } from "@prisma/client";

type SignInEvent = {
    user: User,
    account: {
        id: string,
        type: string,
        providerAccountId: string,
    },
    isNewUser: boolean,
}

const options: NextAuthOptions = {
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
        signIn: '/',
    },
    callbacks: {
        async session(session, user: User) {
            session.user.role = user.role

            if (session.user.email && process.env.MODERATORS.split(',').includes(session.user.email)) {
                session.user.role = Role.moderator;
            }

            return session as any;
        },
        async signIn(user, account, profile) {
            if (!profile.verificationRequest || !/[,; ]/.test(user.email)) {
                return true
            }

            return false;
        },
    },
    events: {
        async signIn(message: SignInEvent) {
            if (!message.isNewUser && message.user.id) {
                await prisma.user.update({
                    where: {
                        id: message.user.id,
                    },
                    data: {
                        updatedAt: new Date(),
                    }
                });
            }
        }
    }
};

// we will define `options` up next
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;