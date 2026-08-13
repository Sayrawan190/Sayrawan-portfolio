import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useLang } from "../context/LangContext";
import { useT } from "../data/uiText";
import { useData } from "../context/DataContext";
import { L } from "../utils/field";
import { EASE } from "../utils/motion";

const SECTIONS = [
  { id: "about", key: "nav_about" },
  { id: "skills", key: "nav_skills" },
  { id: "projects", key: "nav_projects" },
  { id: "experience", key: "nav_experience" },
  { id: "certifications", key: "nav_certs" },
  { id: "contact", key: "nav_contact" },
];

function useIsMobileNav() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 720
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

const panelVariants = {
  closed: { opacity: 0, y: -6, scale: 0.98, pointerEvents: "none", transition: { duration: 0.15, ease: EASE } },
  open: { opacity: 1, y: 0, scale: 1, pointerEvents: "auto", transition: { duration: 0.2, ease: EASE } },
};

export default function Header() {
  const { lang, toggleLang } = useLang();
  const t = useT(lang);
  const { data } = useData();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const isMobile = useIsMobileNav();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return undefined;

    // A thin "reading line" just below the sticky header, rather than a
    // percentage-ratio threshold — ratio thresholds (e.g. 40% of a section's
    // own height) never fire for sections taller than a couple hundred
    // pixels, which is most of them here. threshold: 0 fires on *any*
    // overlap with that line, so exactly one section is active at a time
    // regardless of how tall it is.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { threshold: 0, rootMargin: "-96px 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Nav links are plain `#id` anchors, but this app also uses HashRouter for
  // /dashboard routing — a native anchor click would jump the scroll position
  // instantly (before, or racing with, our own smooth-scroll effect) and
  // simultaneously trigger a route re-render. Taking the click over fully
  // avoids both: we scroll ourselves and sync the hash without dispatching a
  // hashchange the router would otherwise react to.
  function goTo(id, e) {
    e.preventDefault();
    const behavior = reduced ? "auto" : "smooth";
    if (id === "top") {
      window.scrollTo({ top: 0, behavior });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    }
    if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
    setOpen(false);
  }

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="top">
      {!reduced && (
        <motion.span className="nav__scrollProgress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      )}
      <nav className="nav" aria-label="Primary navigation">
        <div className="nav__inner container">
          <a className="brand" href="#top" aria-label="Go to top" onClick={(e) => goTo("top", e)}>
            <span className="brand__mark" aria-hidden="true"></span>
            <span className="brand__text">{L(data.profile.name, lang)}</span>
          </a>

          <button
            className="nav__toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__toggleLines" aria-hidden="true"></span>
          </button>

          <motion.div
            className="nav__links"
            initial={false}
            animate={!isMobile || open ? "open" : "closed"}
            variants={reduced ? undefined : panelVariants}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                className={`nav__link${active === s.id ? " is-active" : ""}`}
                href={`#${s.id}`}
                onClick={(e) => goTo(s.id, e)}
              >
                {active === s.id && (
                  <motion.span
                    className="nav__indicator"
                    layoutId="navIndicator"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
                {t[s.key]}
              </a>
            ))}
          </motion.div>

          <div className="nav__actions">
            <button className="btn btn--ghost" type="button" onClick={toggleLang} aria-label="Toggle language">
              <span className="btn__icon" aria-hidden="true">🌐</span>
              <span className="btn__text">{lang === "ar" ? "EN" : "AR"}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
