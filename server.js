// server.js (updated - use smtp.gmail.com)
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

// ---- Updated transporter: use explicit SMTP host/port/secure ----
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASS,
  },
  // optional: increase timeout if needed
  // connectionTimeout: 10000,
  // greetingTimeout: 10000,
  // socketTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) console.log("MAIL ERROR:", err);
  else console.log("✅ Mail server ready");
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "New Message (Contact Page)",
      text: `Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("SEND MAIL ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`✅ Server running on ${PORT}`)
);
