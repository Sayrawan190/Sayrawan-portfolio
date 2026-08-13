import { isMailerConfigured, sendContactEmail } from "../server/mailer.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBJECT = 150;
const MAX_MESSAGE = 5000;

export async function submitContactMessage(req, res) {
  const { email, subject, message } = req.body ?? {};

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 254) {
    return res.status(400).json({ error: "invalid_email" });
  }
  if (typeof subject !== "string" || !subject.trim() || subject.length > MAX_SUBJECT) {
    return res.status(400).json({ error: "invalid_subject" });
  }
  if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: "invalid_message" });
  }

  if (!isMailerConfigured()) {
    // Not the visitor's fault — surface a distinct error so this doesn't get
    // misread as "your message was invalid" in the UI.
    return res.status(503).json({ error: "mailer_not_configured" });
  }

  try {
    await sendContactEmail({
      fromEmail: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    res.status(502).json({ error: "send_failed" });
  }
}
