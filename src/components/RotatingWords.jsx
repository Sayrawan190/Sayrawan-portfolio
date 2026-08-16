import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { L } from "../utils/field";
import { EASE } from "../utils/motion";

// How long each word stays on screen before the next one slides in — matches
// the toast auto-dismiss timing elsewhere in the app for a consistent pace.
// Deliberately slower than a quick 4s-for-5-words loop; this is one word
// every 2.6s with its own ~0.55s slide, not a fast carousel.
const DWELL_MS = 2600;

// How far the prefix + word are allowed to shrink together to keep them on
// one line before giving up and letting the word wrap onto its own line —
// below this they'd start reading as illegibly small rather than a normal
// smaller heading.
const MIN_SCALE = 0.68;

export default function RotatingWords({ words, lang, prefix, className = "" }) {
  const reduced = useReducedMotion();
  const list = useMemo(
    () => (Array.isArray(words) ? words.filter((w) => L(w, lang)) : []),
    [words, lang]
  );
  const [index, setIndex] = useState(0);
  const measureRef = useRef(null);
  const prefixMeasureRef = useRef(null);
  const rootRef = useRef(null);
  const [reservedWidth, setReservedWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [willWrap, setWillWrap] = useState(false);

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
    const root = rootRef.current;
    if (!container || !root) return undefined;

    function measure() {
      let max = 0;
      for (const span of container.children) {
        max = Math.max(max, span.getBoundingClientRect().width);
      }

      // The prefix + widest word sit side by side (flex-wrap) and only wrap
      // onto their own line past a certain viewport width. Rather than let
      // that happen, shrink both together just enough to keep fitting one
      // line — measured against hidden, always-unscaled clones (both here
      // and the prefix one below) so this stays accurate across repeated
      // resizes instead of compounding against an already-shrunk value.
      const prefixWidth = prefixMeasureRef.current?.getBoundingClientRect().width ?? 0;
      const gap = parseFloat(getComputedStyle(root).columnGap) || 0;
      const available = root.clientWidth;
      const needed = prefixWidth + gap + max;
      // Target 96% of the available width, not a mathematically exact fit —
      // real font rendering rounds to sub-pixel boundaries slightly
      // differently at every size, so aiming for exactly 100% left it a
      // couple of px over in practice and wrapping anyway.
      const rawScale = needed > available ? (available * 0.96) / needed : 1;
      const nextScale = Math.max(rawScale, MIN_SCALE);
      setScale(nextScale);
      setWillWrap(rawScale < MIN_SCALE);
      // Reserve space for the word at whatever size it'll actually render
      // at, not its unscaled measurement, or shrinking it would leave a gap.
      setReservedWidth(Math.floor(max * nextScale));
    }

    // The font-size is `vw`-based (matches the hero name's own responsive
    // scale), so a measurement taken at one viewport width goes stale the
    // moment the window is resized — re-measure whenever that happens.
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [list, prefix]);

  if (list.length === 0) return null;

  const current = L(list[index], lang);

  return (
    <div
      ref={rootRef}
      className={`heroWords ${willWrap ? "is-wrapped" : ""} ${className}`.trim()}
      style={{ "--heroWords-scale": scale }}
    >
      {prefix && <span className="heroWords__prefix">{prefix}</span>}
      {/* Full list once for screen readers, instead of a live region that
          would re-announce a new word every couple of seconds. */}
      <span className="sr-only">{list.map((w) => L(w, lang)).join(", ")}</span>

      {/* Hidden, always-unscaled measuring copies — never styled with the
          --heroWords-scale variable, so measurements stay a true 100%
          baseline no matter what the visible copies are currently scaled to. */}
      <span ref={measureRef} className="heroWords__measure" aria-hidden="true">
        {list.map((w, i) => (
          <span key={i}>{L(w, lang)}</span>
        ))}
      </span>
      {prefix && <span ref={prefixMeasureRef} className="heroWords__measurePrefix" aria-hidden="true">{prefix}</span>}

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
