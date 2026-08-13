import nodemailer from "nodemailer";

// Defaults target Gmail + an App Password (smtp.gmail.com:465, implicit TLS),
// since that's the zero-signup option most people already have. Any other
// SMTP provider works too — just override SMTP_HOST/SMTP_PORT/SMTP_SECURE.
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export function isMailerConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

// `from` must be the authenticated SMTP account (Gmail rejects/flags mail
// sent "from" an address it didn't authenticate as) — the visitor's address
// goes in `replyTo` instead, so hitting Reply in an inbox goes straight back
// to them. Sends to CONTACT_TO_EMAIL, defaulting to the same Gmail inbox
// that's doing the sending.
export async function sendContactEmail({ fromEmail, subject, message }) {
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const text = `New message from the portfolio contact form.\n\nFrom: ${fromEmail}\nSubject: ${subject}\n\n${message}`;
  const html = `
    <p>New message from the portfolio contact form.</p>
    <p><strong>From:</strong> ${escapeHtml(fromEmail)}<br/>
    <strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  await getTransporter().sendMail({
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to,
    replyTo: fromEmail,
    subject: `[Portfolio contact] ${subject}`,
    text,
    html,
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
