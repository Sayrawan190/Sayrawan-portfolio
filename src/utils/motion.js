// Shared Motion (motion/react) variants and timing constants for the public
// portfolio. Keeping these in one place is what makes the animation language
// consistent across Hero/Header/Skills/Projects/Experience/Certificates
// instead of every component inventing its own durations and easing.
//
// Every variant generator takes `reduced` (from `useReducedMotion()`) and
// collapses to an instant, motion-free equivalent when the visitor has
// requested less motion — CSS's `prefers-reduced-motion` query only covers
// CSS transitions/animations, not JS-driven Motion values, so each component
// that animates via Motion calls these generators with its own
// `useReducedMotion()` result rather than relying on CSS alone.

export const EASE = [0.16, 1, 0.3, 1];

export const viewportOnce = { once: true, amount: 0.2 };

export function fadeUp(reduced, { y = 18, duration = 0.5, delay = 0 } = {}) {
  if (reduced) {
    return { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0, transition: { duration: 0 } } };
  }
  return {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
  };
}

export function fadeIn(reduced, { duration = 0.4, delay = 0 } = {}) {
  if (reduced) {
    return { hidden: { opacity: 1 }, show: { opacity: 1, transition: { duration: 0 } } };
  }
  return { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration, delay, ease: EASE } } };
}

export function scaleIn(reduced, { scale = 0.96, duration = 0.35, delay = 0 } = {}) {
  if (reduced) {
    return { hidden: { opacity: 1, scale: 1 }, show: { opacity: 1, scale: 1, transition: { duration: 0 } } };
  }
  return {
    hidden: { opacity: 0, scale },
    show: { opacity: 1, scale: 1, transition: { duration, delay, ease: EASE } },
  };
}

export function staggerParent(reduced, { stagger = 0.08, delayChildren = 0 } = {}) {
  return {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delayChildren } },
  };
}

// Hover/tap feedback for interactive elements — small, consistent, and a no-op
// under reduced motion so nothing moves on hover/tap for those visitors.
export function liftHover(reduced) {
  return reduced ? {} : { y: -3, transition: { duration: 0.18, ease: EASE } };
}
export function tapScale(reduced) {
  return reduced ? {} : { scale: 0.97 };
}
export function pressScale(reduced) {
  return reduced ? {} : { scale: 1.02, transition: { duration: 0.18, ease: EASE } };
}

export const springSnappy = { type: "spring", stiffness: 420, damping: 30, mass: 0.7 };
export const springSoft = { type: "spring", stiffness: 260, damping: 24, mass: 0.8 };
