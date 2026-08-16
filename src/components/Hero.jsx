import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { fadeUp, liftHover, staggerParent, tapScale } from "../utils/motion";
import RotatingWords from "./RotatingWords";

export default function Hero() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const p = data.profile;
  const [imgOk, setImgOk] = useState(true);
  const reduced = useReducedMotion();

  const container = staggerParent(reduced, { stagger: 0.09, delayChildren: 0.05 });
  const item = fadeUp(reduced, { y: 16 });
  const itemSm = fadeUp(reduced, { y: 12, duration: 0.4 });

  return (
    <section className="hero section" aria-label="Hero">
      <motion.div className="container hero__grid" variants={container} initial="hidden" animate="show">
        <div className="hero__content">
          <motion.p className="pill" variants={item}>
            <span className="pill__dot" aria-hidden="true"></span>
            {t.hero_pill}
          </motion.p>
          <motion.h1 className="hero__title" variants={item}>
            <span>{L(p.name, lang)}</span>
          </motion.h1>

          {Array.isArray(p.roleWords) && p.roleWords.length > 0 && (
            <motion.div variants={item}>
              <RotatingWords words={p.roleWords} lang={lang} prefix={t.hero_words_prefix} />
            </motion.div>
          )}

          <motion.p className="hero__role" variants={item}>{L(p.title, lang)}</motion.p>
          <motion.p className="hero__tagline" variants={item}>{L(p.tagline, lang)}</motion.p>

          <motion.div className="hero__cta" variants={item}>
            {p.cvLink && (
              <motion.a
                className="btn btn--primary"
                href={p.cvLink}
                download="Abdullah Al-Serawan CV.pdf"
                aria-label="Download CV"
                whileHover={liftHover(reduced)}
                whileTap={tapScale(reduced)}
              >
                {t.hero_download}
              </motion.a>
            )}
            {p.linkedin && (
              <motion.a
                className="btn btn--ghost"
                href={p.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={liftHover(reduced)}
                whileTap={tapScale(reduced)}
              >
                <span className="btn__icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.87 3.36 3.66z" fill="currentColor" />
                  </svg>
                </span>
                <span className="btn__text">{t.hero_linkedin}</span>
              </motion.a>
            )}
            {p.x && (
              <motion.a
                className="btn btn--ghost"
                href={p.x}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={liftHover(reduced)}
                whileTap={tapScale(reduced)}
              >
                <span className="btn__icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-7.2L5.9 22H2l7.4-8.5L1 2h6.3l4.4 6.5L18.9 2Zm-1.1 18h1.7L6.2 3.9H4.4L17.8 20Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="btn__text">{t.hero_x}</span>
              </motion.a>
            )}
          </motion.div>

          <motion.div className="hero__meta" variants={item}>
            <div className="metaCard">
              <p className="metaCard__label">{t.meta_languages_label}</p>
              <p className="metaCard__value">{L(p.focus, lang)}</p>
            </div>
            <div className="metaCard">
              <p className="metaCard__label">{t.meta_location_label}</p>
              <p className="metaCard__value">{L(p.location, lang)}</p>
            </div>
          </motion.div>
        </div>

        <div className="hero__media">
          <motion.div className="photoCard" aria-label="Personal photo" variants={itemSm}>
            {p.photo && imgOk ? (
              <img
                className="photoCard__img"
                src={p.photo}
                alt={L(p.name, lang)}
                loading="lazy"
                onError={() => setImgOk(false)}
              />
            ) : (
              <div className="photoCard__fallback">
                <div className="photoFallback">
                  <span className="photoFallback__icon" aria-hidden="true">👤</span>
                  <p className="photoFallback__text">{t.photo_placeholder}</p>
                </div>
              </div>
            )}
          </motion.div>

          {Array.isArray(p.summary) && p.summary.length > 0 && (
            <motion.div className="statusCard" role="note" aria-label="Quick summary" variants={itemSm}>
              <p className="statusCard__title">{t.status_title}</p>
              <ul className="statusCard__list">
                {p.summary.map((point, i) => (
                  <li key={i}>{L(point, lang)}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="hero__bg" aria-hidden="true"></div>
      <div className="hero__grain" aria-hidden="true"></div>

      <motion.a
        href="#about"
        className="hero__scrollCue"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, y: [0, 6, 0] }
        }
        transition={
          reduced
            ? { duration: 0.4, delay: 0.9 }
            : { opacity: { delay: 1, duration: 0.6 }, y: { delay: 1.3, duration: 1.8, repeat: Infinity, ease: "easeInOut" } }
        }
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4v14m0 0-5-5m5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>
    </section>
  );
}
