import nodemailer from 'nodemailer';

const smtp = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
} as any, {
    from: process.env.SMTP_FROM,
    replyTo: process.env.SMTP_REPLY_TO || undefined,
});

export default smtp;