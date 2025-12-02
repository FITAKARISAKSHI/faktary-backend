// test-mail.js
require('dotenv').config();
const { MailerSend } = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const FROM_EMAIL = process.env.FROM_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

const testMail = async () => {
  try {
    await mailerSend.email.send({
      from: { email: FROM_EMAIL, name: "Faktary" },
      to: [{ email: TO_EMAIL, name: "Faktary" }],
      subject: "Test Mail - Local",
      text: "Hello! This is a local test mail from Faktary backend."
    });
    console.log("✅ Success! Mail sent.");
  } catch (err) {
    console.log("❌ Error sending mail:", err.response ? err.response.data : err.message);
  }
};

testMail();
