const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendMail({ to, subject, html }) {
  const client = getTransporter();
  if (!client) {
    // No SMTP configured (e.g. local dev without .env values) — log instead of
    // failing the request, so the reset/order flow keeps working in dev.
    console.warn(`[email] SMTP chưa được cấu hình, in nội dung email thay vì gửi:\nTo: ${to}\nSubject: ${subject}\n${html}`);
    return;
  }

  await client.sendMail({
    from: process.env.EMAIL_FROM || 'SHMILY <no-reply@shmily.vn>',
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
