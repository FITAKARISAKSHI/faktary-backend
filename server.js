// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MailerSend } = require("mailersend");

const app = express();

/* =======================
   MIDDLEWARES
======================= */

// CORS (Frontend allow)
app.use(
  cors({
    origin: "https://faktary-frontend.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Body parser
app.use(bodyParser.json());

/* =======================
   ENV CHECK (LOGS)
======================= */

console.log(
  "MAILERSEND_API_KEY:",
  process.env.MAILERSEND_API_KEY ? "✅ set" : "❌ missing"
);
console.log(
  "FROM_EMAIL:",
  process.env.FROM_EMAIL ? process.env.FROM_EMAIL : "❌ missing"
);
console.log(
  "TO_EMAIL:",
  process.env.TO_EMAIL ? process.env.TO_EMAIL : "❌ missing"
);

/* =======================
   MAILERSEND SETUP
======================= */

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const FROM_EMAIL = process.env.FROM_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

/* =======================
   ROUTES
======================= */

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Contact form
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await mailerSend.email.send({
      from: {
        email: FROM_EMAIL,
        name: "Faktary",
      },
      to: [
        {
          email: TO_EMAIL,
          name: "Faktary",
        },
      ],
      subject: "New Message (Contact Page)",
      text: `Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(
      "Contact Mail Error:",
      err.response ? err.response.data : err
    );
    res.status(500).json({
      success: false,
      error: "Mail sending failed",
    });
  }
});

// Reach Us form
app.post("/api/reachus", async (req, res) => {
  const { name, company, fullPhone, email, message } = req.body;

  try {
    await mailerSend.email.send({
      from: {
        email: FROM_EMAIL,
        name: "Faktary",
      },
      to: [
        {
          email: TO_EMAIL,
          name: "Faktary",
        },
      ],
      subject: "New Business Inquiry (Reach Us Form)",
      text: `Name: ${name}
Company: ${company}
Phone: ${fullPhone}
Email: ${email}
Message: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(
      "ReachUs Mail Error:",
      err.response ? err.response.data : err
    );
    res.status(500).json({
      success: false,
      error: "Mail sending failed",
    });
  }
});

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
