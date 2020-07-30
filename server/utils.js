const dotenv = require('dotenv');
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env' });

export const isEmpty = fieldValue => {
  return !(fieldValue.trim().length === 0);
}

export const handleError = ({ errors }, res) => {
  const modelErrors = Object.keys(errors);

  return res.status(400).send({
    status: 'failed',
    message: errors[modelErrors.shift()].message,
  });
}

export const createMailResetTemplate = (username, url, passwordResetToken) => (
  `<body>
      <div style="outline: #F3F3F7 3px solid; padding: 10px; max-width: 630px; margin: 0 auto;">
        <div style="background-color:#F3F3F7; padding:10px; color:#BFBFC1; font-size: 12px; text-align: center; margin-bottom: 25px;">User Auth Sample App</div>
        <div>
          <div style="margin: 0 auto; max-width: 315px; font-size: 10px; color: #8893A3; flex-direction: column;">
            <p style="color: #000"><b>Hi ${username},</b></p>
            <p>You recently requested a password reset link for your user_auth_app account. Click the button below to reset it.</p>
            <a href="${url}/reset?resetToken=${passwordResetToken}" style="margin: 25px auto; background: #EE5A33; color: #fff; width: 130px; height: 48px; border-radius: 3px; font-size: 10px;  text-decoration: none; padding: 5px 10px;">
                Reset your password
            </a>
            <p>If you did not request a password reset, please ignore this email. This password reset is only valid for the next 15 minutes.</p>
            Thanks,<br /> Emeka and the user_auth_app team. <hr  style="margin-top: 15px; margin-bottom: 15px; border-top: 0.5px solid #F3F3F7;" />
            If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser.<br />
            ${url}/reset?resetToken=${passwordResetToken}
          </div>
        </div>
        <div style="background-color:#F3F3F7; padding:10px; color:#BFBFC1; font-size: 10px; text-align: center; margin-top: 25px;">
          <p>&copy; 2020 user_auth_app Corporation. All rights reserved.</p>
          user_auth_app Corporation<br />
          235 Victoria Garden City, <br />
          Lagos, NG.
        </div>
      </div>
    </body>`
);

const mailTransporter = nodemailer.createTransport({
  service: 'Gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendMail = (recipentEmail, subject, messageTemplate) => mailTransporter.sendMail({
  from: 'Your friends at user_auth_sample <user_auth_sample.mailer@gmail.com>',
  to: recipentEmail,
  subject,
  html: messageTemplate
});
