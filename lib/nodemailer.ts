import nodemailer from "nodemailer";

const email = process.env.EMAILSENDER;
const pass = process.env.TOKENEMAILSENDER;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions = {
  from: email,
};