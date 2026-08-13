import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { useFocusTrap } from "../utils/useFocusTrap";
import { fadeUp, scaleIn, staggerParent, viewportOnce } from "../utils/motion";

function CertModal({ cert, lang, t, onClose }) {
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const isOpen = Boolean(cert);
  const [renderedCert, setRenderedCert] = useState(cert);
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    if (cert) {
      setRenderedCert(cert);
      setImgOk(true);
    }
  }, [cert]);

  useFocusTrap(isOpen, panelRef, onClose);

  return (
    <div
      className={`modal${isOpen ? " is-open" : ""}`}
      role="presentation"
      style={{ display: "grid", pointerEvents: isOpen ? "auto" : "none" }}
    >
      <AnimatePresence>
        {isOpen && renderedCert && (
          <>
            <motion.div
              key="backdrop"
              className="modal__backdrop"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              tabIndex={-1}
              className="modal__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="certModalTitle"
              variants={scaleIn(reduced)}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="modal__head">
                <h3 className="modal__title" id="certModalTitle">{L(renderedCert.name, lang)}</h3>
                <button className="iconBtn" type="button" onClick={onClose} aria-label="Close modal">✕</button>
              </div>
              <div className="modal__content">
                <p className="modal__meta">
                  {[
                    L(renderedCert.issuer, lang) ? `${t.cert_modal_meta_prefix}: ${L(renderedCert.issuer, lang)}` : "",
                    renderedCert.date ? `${t.cert_modal_date_prefix}: ${renderedCert.date}` : "",
                  ].filter(Boolean).join(" — ")}
                </p>

                <div className="certPreview" aria-label="Certificate preview">
                  {renderedCert.image && imgOk ? (
                    <img
                      src={renderedCert.image}
                      alt={L(renderedCert.name, lang)}
                      loading="lazy"
                      onError={() => setImgOk(false)}
                    />
                  ) : (
                    <div className="certPlaceholder">
                      <span className="certPlaceholder__icon" aria-hidden="true">📄</span>
                      <p className="certPlaceholder__text">{t.cert_placeholder}</p>
                    </div>
                  )}
                </div>

                <div className="modal__actions">
                  {renderedCert.link && (
                    <a className="btn btn--ghost" href={renderedCert.link} target="_blank" rel="noopener noreferrer">
                      <span className="btn__icon" aria-hidden="true">🔗</span>
                      <span className="btn__text">{t.cert_open_link}</span>
                    </a>
                  )}
                  <button className="btn btn--primary" type="button" onClick={onClose}>{t.close_btn}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Certificates() {
  const { lang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const certs = data.certificates || [];
  const [activeCert, setActiveCert] = useState(null);
  const reduced = useReducedMotion();

  const container = staggerParent(reduced, { stagger: 0.08 });
  const chip = fadeUp(reduced, { y: 16 });

  return (
    <section className="section" id="certifications" aria-label="Certifications">
      <div className="container">
        <div className="sectionHead">
          <div>
            <p className="sectionEyebrow" aria-hidden="true">
              <span className="sectionEyebrow__line"></span>05
            </p>
            <h2 className="sectionTitle">{t.certs_title}</h2>
          </div>
          <p className="sectionSubtitle">{t.certs_subtitle}</p>
        </div>

        {certs.length === 0 ? (
          <div className="emptyState">{t.empty_certs}</div>
        ) : (
          <motion.div
            className="certStrip"
            aria-label="Certificates"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {certs.map((cert) => (
              <motion.button
                key={cert.id}
                type="button"
                className="certChip"
                variants={chip}
                whileHover={reduced ? {} : { y: -3 }}
                onClick={() => setActiveCert(cert)}
              >
                {cert.image ? (
                  <img className="certChip__media" src={cert.image} alt={L(cert.name, lang)} loading="lazy" />
                ) : (
                  <div className="certChip__media" aria-hidden="true" />
                )}
                <div className="certChip__body">
                  <div className="certChip__top">
                    <h3 className="certChip__title">{L(cert.name, lang)}</h3>
                    <span className="certBadge" aria-hidden="true">✓</span>
                  </div>
                  {L(cert.issuer, lang) && <p className="certChip__org">{L(cert.issuer, lang)}</p>}
                  {cert.date && <p className="certChip__meta">{cert.date}</p>}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      <CertModal cert={activeCert} lang={lang} t={t} onClose={() => setActiveCert(null)} />
    </section>
  );
}
