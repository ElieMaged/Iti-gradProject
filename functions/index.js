const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const GMAIL_USER = 'elie1400674@gmail.com';
const GMAIL_PASS = 'Harambe100';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});

exports.sendBookingConfirmation = functions.https.onCall(async (data, context) => {
  const { email, technicianName, date, time, payment } = data;
  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: 'Your Booking Confirmation',
    html: `
      <h2>Booking Confirmed!</h2>
      <p><b>Technician:</b> ${technicianName}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Payment Method:</b> ${payment}</p>
      <p>Thank you for booking with us!</p>
    `
  };
  await transporter.sendMail(mailOptions);
  return { success: true };
});
