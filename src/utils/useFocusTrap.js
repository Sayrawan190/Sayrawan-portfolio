import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Traps Tab navigation inside `containerRef` while `active`, moves focus in on
// open, restores it to the previously focused element on close, and calls
// `onClose` for Escape. Used by the Certificates modal; kept generic enough to
// reuse for any future dialog.
export function useFocusTrap(active, containerRef, onClose) {
  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;
    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    const raf = requestAnimationFrame(() => {
      const [first] = getFocusable();
      (first || container).focus?.();
    });

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (!nodes.length) return;
      const firstEl = nodes[0];
      const lastEl = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, onClose]);
}
