
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASS
  }
});

app.post('/api/reachus', async (req, res) => {
  const { name, company, fullPhone, email, message } = req.body;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: 'New Business Inquiry (Reach Us Form)',
    text: `Name: ${name}
Company: ${company}
Phone: ${fullPhone}
Email: ${email}
Message: ${message}`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.toString() });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: 'New Message (Contact Page)',
    text: `Name: ${name} 
Email: ${email}
Phone: ${phone}
Message: ${message}`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.toString() });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
