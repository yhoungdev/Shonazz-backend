import path from 'path';

const nodemailer = require('nodemailer');
require('dotenv').config();
const handlebarsExpress = require('nodemailer-express-handlebars');

interface Nodemailer {
  email: string;
  subject?: string;
  template?: string;
  body: any;
}

const sendMail = ({ email, subject, body, template }: Nodemailer) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: 'jvvn cofm qvyy hkdj',
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve('./views/'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
  };

  transporter.use('compile', handlebarsExpress(handlebarOptions));

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    template: template,
    subject: subject,
    context: body,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(info.response);
      }
    });
  });
};

export { sendMail };
