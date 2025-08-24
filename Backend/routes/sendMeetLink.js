// Backend route for sending Google Meet link email from themindmates.in@gmail.com
// Place this in your Backend/routes/ directory as sendMeetLink.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer transporter with your Gmail credentials or App Password
defaultSender = 'themindmates.in@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MINDMATES_EMAIL || defaultSender,
    pass: process.env.MINDMATES_EMAIL_PASS // Use an App Password for Gmail
  }
});

router.post('/', async (req, res) => {
  const { to, name, meetLink, from } = req.body;
  if (!to || !meetLink) {
    return res.status(400).json({ error: 'Missing recipient or meet link.' });
  }

  const mailOptions = {
    from: from || defaultSender,
    to,
    subject: 'Your Mindmates Appointment Google Meet Link',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello${name ? ' ' + name : ''},</h2>
        <p>Your Google Meet link for your Mindmates appointment is below:</p>
        <p><a href="${meetLink}" style="color: #4f46e5; font-weight: bold;">Join Meet</a></p>
        <p>If you have any questions, reply to this email.</p>
        <br/>
        <p>Best regards,<br/>The Mindmates Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;
