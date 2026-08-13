import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { fadeUp, liftHover, staggerParent, tapScale, viewportOnce } from "../utils/motion";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  async function handleCopy(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (older browser / no permission) — the
      // number is still visible and selectable, so this is a silent no-op.
    }
  }

  return (
    <>
      <button
        type="button"
        className="iconBtn iconBtn--sm"
        onClick={handleCopy}
        aria-label="Copy phone number"
      >
        <CopyIcon />
      </button>
      <AnimatePresence>
        {copied && (
          <motion.span
            className="contactItem__copied"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0.1 : 0.18 }}
          >
            Copied
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}

const EMPTY_FORM = { email: "", subject: "", message: "" };

function ContactForm({ t, reduced }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast(t.contact_form_success);
        setForm(EMPTY_FORM);
      } else if (res.status === 429) {
        showToast(t.contact_form_error_rate_limited, "danger");
      } else if (res.status === 400) {
        showToast(t.contact_form_error_invalid, "danger");
      } else {
        showToast(t.contact_form_error_generic, "danger");
      }
    } catch {
      showToast(t.contact_form_error_generic, "danger");
    } finally {
      setSending(false);
    }
  }

  return (
    <motion.form
      className="contactFormCard card card--pad"
      variants={fadeUp(reduced, { y: 16 })}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      onSubmit={handleSubmit}
    >
      <h3 className="contactForm__title">{t.contact_form_title}</h3>
      <div className="formGrid formGrid--single">
        <div className="field">
          <label htmlFor="contact-email">{t.contact_form_email_label}</label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={254}
            value={form.email}
            placeholder={t.contact_form_email_placeholder}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-subject">{t.contact_form_subject_label}</label>
          <input
            id="contact-subject"
            type="text"
            required
            maxLength={150}
            value={form.subject}
            placeholder={t.contact_form_subject_placeholder}
            onChange={(e) => set("subject", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-message">{t.contact_form_message_label}</label>
          <textarea
            id="contact-message"
            required
            maxLength={5000}
            value={form.message}
            placeholder={t.contact_form_message_placeholder}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
      </div>
      <motion.button
        className="btn btn--primary"
        type="submit"
        disabled={sending}
        whileHover={liftHover(reduced)}
        whileTap={tapScale(reduced)}
      >
        {sending ? t.contact_form_sending : t.contact_form_submit}
      </motion.button>
    </motion.form>
  );
}

export default function Contact() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const p = data.profile;
  const reduced = useReducedMotion();

  const container = staggerParent(reduced, { stagger: 0.08 });
  const item = fadeUp(reduced, { y: 14 });

  return (
    <section className="section" id="contact" aria-label="Contact">
      <div className="container">
        <div className="sectionHead">
          <div>
            <p className="sectionEyebrow" aria-hidden="true">
              <span className="sectionEyebrow__line"></span>06
            </p>
            <h2 className="sectionTitle">{t.contact_title}</h2>
          </div>
          <p className="sectionSubtitle">{t.contact_subtitle}</p>
        </div>

        <div className="contactCard card card--pad">
          <motion.div
            className="contactGrid"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {p.x && (
              <motion.a
                className="contactItem"
                href={p.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open X profile"
                variants={item}
                whileHover={liftHover(reduced)}
              >
                <span className="contactIcon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-7.2L5.9 22H2l7.4-8.5L1 2h6.3l4.4 6.5L18.9 2Zm-1.1 18h1.7L6.2 3.9H4.4L17.8 20Z" fill="currentColor" />
                  </svg>
                </span>
                <div className="contactText">
                  <p className="contactLabel">X</p>
                  <p className="contactValue">{p.x.replace(/^https?:\/\/(www\.)?x\.com\//, "@").split("?")[0]}</p>
                </div>
              </motion.a>
            )}

            {p.linkedin && (
              <motion.a
                className="contactItem"
                href={p.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
                variants={item}
                whileHover={liftHover(reduced)}
              >
                <span className="contactIcon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6.94 6.5a2.19 2.19 0 1 1 0-4.38 2.19 2.19 0 0 1 0 4.38ZM3.5 21.5V8.5h6.88v13H3.5Zm10.6 0V8.5h6.6v1.78c.92-1.22 2.36-2.25 4.78-2.25 4.2 0 6.02 2.47 6.02 7.2v6.27h-6.88v-5.66c0-2.1-.4-3.3-2.01-3.3-1.18 0-1.88.79-2.18 1.55-.12.3-.16.7-.16 1.11v6.3h-6.17Z" fill="currentColor" />
                  </svg>
                </span>
                <div className="contactText">
                  <p className="contactLabel">LinkedIn</p>
                  <p className="contactValue">{t.contact_linkedin_value}</p>
                </div>
              </motion.a>
            )}

            {p.phone && (
              <motion.a
                className="contactItem"
                href={`tel:${p.phone.replace(/\s+/g, "")}`}
                aria-label="Call phone number"
                variants={item}
                whileHover={liftHover(reduced)}
              >
                <span className="contactIcon" aria-hidden="true">📞</span>
                <div className="contactText">
                  <p className="contactLabel">{t.contact_phone}</p>
                  <p className="contactValue">{p.phone}</p>
                </div>
                <CopyButton value={p.phone} />
              </motion.a>
            )}
          </motion.div>
        </div>

        <ContactForm t={t} reduced={reduced} />

        <Footer name={p.name} lang={lang} t={t} />
      </div>
    </section>
  );
}

function Footer({ name, lang, t }) {
  const year = new Date().getFullYear();
  const displayName = typeof name === "string" ? name : name?.[lang] || name?.en || "";
  return (
    <footer className="footer">
      <p className="footer__text">
        <span>{t.footer_text}</span> <span>{year}</span> <span>{displayName}</span>
      </p>
    </footer>
  );
}
