const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const defaultEmailData = { from: "noreply@Gather.com" };

exports.sendEmail = (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  return transporter
    .sendMail(emailData)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};
