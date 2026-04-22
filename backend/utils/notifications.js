// Email + SMS Notifications
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../models/User');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  });
};

const sendSMS = async (to, message) => {
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to
  });
};

const notifyEscalation = async (complaint) => {
  const user = await User.findById(complaint.user);
  const msg = `Your complaint ${complaint.complaintId} escalated to level ${complaint.escalationLevel}. TAT: ${3 * complaint.escalationLevel} days`;
  
  sendEmail(user.email, 'Complaint Escalated - CCMS PNGRB', msg);
  sendSMS(user.phone, msg);
};

module.exports = { sendEmail, sendSMS, notifyEscalation };
