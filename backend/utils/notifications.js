const nodemailer = require('nodemailer');
const twilio = require('twilio');

let transporter;
let twilioClient;

const initNotifications = () => {
  // Email
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // SMS (Twilio) - Optional, skip if no env vars
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
};

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log('📧 Email sent to', to);
  } catch (err) {
    console.log('Email failed:', err.message);
  }
};

const sendSMS = async (phone, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
    console.log('📱 SMS sent to', phone);
  } catch (err) {
    console.log('SMS failed:', err.message);
  }
};

const sendNotification = async (user, message) => {
  console.log('🔔 Notification:', message);
  
  if (user.email) {
    await sendEmail(user.email, 'CCMS PNGRB Update', message);
  }
  
  if (user.phone) {
    await sendSMS(user.phone, message);
  }
};

module.exports = { sendNotification, initNotifications };

