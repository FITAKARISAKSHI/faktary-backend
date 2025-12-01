// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MailerSend } = require('mailersend');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MailerSend client
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY, // Put your MailerSend token in .env
});

// Emails
const FROM_EMAIL = process.env.FROM_EMAIL; // Must be verified in MailerSend
const TO_EMAIL = process.env.TO_EMAIL;     // Where you want to receive all form submissions

// Contact route
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await mailerSend.email.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: 'New Message (Contact Page)',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log('Contact Mail Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ReachUs route
app.post('/api/reachus', async (req, res) => {
  const { name, company, fullPhone, email, message } = req.body;

  try {
    await mailerSend.email.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: 'New Business Inquiry (Reach Us Form)',
      text: `Name: ${name}\nCompany: ${company}\nPhone: ${fullPhone}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log('ReachUs Mail Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
