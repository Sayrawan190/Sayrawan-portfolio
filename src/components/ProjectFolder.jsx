import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { scaleIn } from "../utils/motion";
import { useFocusTrap } from "../utils/useFocusTrap";

export const MAX_PROJECT_IMAGES = 5;

function LightboxModal({ images, index, title, t, onClose, onPrev, onNext }) {
  const reduced = useReducedMotion();
  const panelRef = useRef(null);
  const isOpen = index !== null;

  useFocusTrap(isOpen, panelRef, onClose);

  useEffect(() => {
    if (!isOpen) return undefined;
    function onKeyDown(e) {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onNext, onPrev]);

  const src = isOpen ? images[index] : null;
  const showNav = images.length > 1;

  return (
    <div
      className={`modal${isOpen ? " is-open" : ""}`}
      role="presentation"
      style={{ display: "grid", pointerEvents: isOpen ? "auto" : "none" }}
    >
      <AnimatePresence>
        {isOpen && (
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
              className="modal__panel projLightbox__panel"
              role="dialog"
              aria-modal="true"
              aria-label={title}
              variants={scaleIn(reduced)}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <div className="modal__head">
                <h3 className="modal__title">
                  {title}
                  {showNav ? ` — ${index + 1}/${images.length}` : ""}
                </h3>
                <button className="iconBtn" type="button" onClick={onClose} aria-label={t.close_btn}>✕</button>
              </div>
              <div className="modal__content projLightbox__content">
                {showNav && (
                  <button type="button" className="projLightbox__nav projLightbox__nav--prev" onClick={onPrev} aria-label={t.folder_prev}>
                    ‹
                  </button>
                )}
                <img className="projLightbox__image" src={src} alt={`${title} ${index + 1}`} />
                {showNav && (
                  <button type="button" className="projLightbox__nav projLightbox__nav--next" onClick={onNext} aria-label={t.folder_next}>
                    ›
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectFolder({ images, title, t }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const shown = (images || []).slice(0, MAX_PROJECT_IMAGES);
  const count = shown.length;

  if (count === 0) return null;

  function toggle() {
    setOpen((o) => !o);
  }

  function onKeyDownToggle(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  }

  function openLightbox(e, i) {
    e.stopPropagation();
    setActiveIndex(i);
  }

  function onFileKeyDown(e, i) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(e, i);
    }
  }

  function closeLightbox() {
    setActiveIndex(null);
  }

  function navBy(delta) {
    setActiveIndex((i) => (i === null ? i : (i + delta + count) % count));
  }

  return (
    <>
      <div
        className={`projFolder${open ? " is-open" : ""}`}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={open ? t.folder_close : t.folder_open}
        onClick={toggle}
        onKeyDown={onKeyDownToggle}
      >
        <div className="projFolder__stage">
          <div className="projFolder__back" aria-hidden="true">
            <span className="projFolder__tab"></span>
          </div>
          <div className="projFolder__files">
            {shown.map((src, i) => (
              <button
                key={i}
                type="button"
                className="projFolder__file"
                style={{ "--i": i }}
                tabIndex={open ? 0 : -1}
                aria-label={`${title} ${i + 1}/${count}`}
                onClick={(e) => openLightbox(e, i)}
                onKeyDown={(e) => onFileKeyDown(e, i)}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="projFolder__front" aria-hidden="true">
            <div className="projFolder__icon"></div>
          </div>
          <div className="projFolder__counter" aria-hidden="true">
            <span className="projFolder__counterDot"></span>
            <span className="projFolder__counterNum">{count}</span>
          </div>
          {!open && <div className="projFolder__hint">{t.folder_open}</div>}
        </div>
      </div>

      <LightboxModal
        images={shown}
        index={activeIndex}
        title={title}
        t={t}
        onClose={closeLightbox}
        onPrev={() => navBy(-1)}
        onNext={() => navBy(1)}
      />
    </>
  );
}
