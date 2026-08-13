import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { L } from "../utils/field";
import { EASE } from "../utils/motion";

// How long each word stays on screen before the next one slides in — matches
// the toast auto-dismiss timing elsewhere in the app for a consistent pace.
// Deliberately slower than a quick 4s-for-5-words loop; this is one word
// every 2.6s with its own ~0.55s slide, not a fast carousel.
const DWELL_MS = 2600;

export default function RotatingWords({ words, lang, prefix, className = "" }) {
  const reduced = useReducedMotion();
  const list = useMemo(
    () => (Array.isArray(words) ? words.filter((w) => L(w, lang)) : []),
    [words, lang]
  );
  const [index, setIndex] = useState(0);
  const measureRef = useRef(null);
  const [reservedWidth, setReservedWidth] = useState(0);

  useLayoutEffect(() => {
    setIndex(0);
  }, [list.length]);

  useLayoutEffect(() => {
    if (list.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, DWELL_MS);
    return () => window.clearInterval(id);
  }, [list.length]);

  // The sliding word is positioned absolutely (so the outgoing/incoming pair
  // can overlap mid-transition), which means it can't size its own
  // container — reserve enough width for the widest word up front instead,
  // or a longer entry would get clipped by the viewport's overflow:hidden.
  // A character-count (`ch`) guess isn't reliable here, since the word is
  // bold (font-weight: 800) and can mix scripts — so instead this measures
  // every word's *actual* rendered width via hidden copies using the exact
  // same typography, before the browser paints.
  useLayoutEffect(() => {
    const container = measureRef.current;
    if (!container) return undefined;

    function measure() {
      let max = 0;
      for (const span of container.children) {
        max = Math.max(max, span.getBoundingClientRect().width);
      }
      setReservedWidth(Math.ceil(max));
    }

    // The font-size is `vw`-based (matches the hero name's own responsive
    // scale), so a measurement taken at one viewport width goes stale the
    // moment the window is resized — re-measure whenever that happens.
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [list]);

  if (list.length === 0) return null;

  const current = L(list[index], lang);

  return (
    <div className={`heroWords ${className}`.trim()}>
      {prefix && <span className="heroWords__prefix">{prefix}</span>}
      {/* Full list once for screen readers, instead of a live region that
          would re-announce a new word every couple of seconds. */}
      <span className="sr-only">{list.map((w) => L(w, lang)).join(", ")}</span>

      <span ref={measureRef} className="heroWords__measure" aria-hidden="true">
        {list.map((w, i) => (
          <span key={i}>{L(w, lang)}</span>
        ))}
      </span>

      <span
        className="heroWords__viewport"
        style={reservedWidth ? { width: `${reservedWidth}px` } : undefined}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            className="heroWords__word"
            initial={reduced ? { opacity: 1 } : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.55, ease: EASE }}
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
