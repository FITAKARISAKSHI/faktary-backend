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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASS,
  },
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
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`✅ Server running on ${PORT}`)
);
