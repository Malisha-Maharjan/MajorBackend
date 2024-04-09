const nodemailer = require("nodemailer");
import { env } from "./env";

export const sendEmail = async (
  email: [string],
  subject: string,
  html: string
) => {
  const smtpConnector = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_HOST,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
  smtpConnector.verify().then(console.log).catch(console.error);
  console.log(email);
  const mailOptions = {
    from: env.SMTP_USER,
    to: email,
    subject: subject,
    html: html,
  };

  smtpConnector.sendMail(mailOptions);
};
