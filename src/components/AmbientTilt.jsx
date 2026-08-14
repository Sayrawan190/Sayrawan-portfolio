import { useEffect, useRef } from "react";

// Not a spotlight that follows the cursor — the ambient background glow
// (same soft, oversized radial gradients as the static one in index.css)
// just leans a small, capped amount toward wherever the cursor is, based on
// its direction from the viewport center rather than its exact position.
// CSS handles the easing (transition on transform) so JS only ever needs to
// set a target offset, not animate anything itself.
const MAX_SHIFT = 46; // px — how far the layer can lean, capped well short of ever reading as "a shape chasing the mouse"

export default function AmbientTilt() {
  const layerRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return undefined;

    const layer = layerRef.current;
    if (!layer) return undefined;

    let raf = null;

    function onMove(e) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
        const ny = e.clientY / window.innerHeight - 0.5;
        layer.style.setProperty("--tiltX", `${(nx * 2 * MAX_SHIFT).toFixed(1)}px`);
        layer.style.setProperty("--tiltY", `${(ny * 2 * MAX_SHIFT).toFixed(1)}px`);
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="bgTilt" ref={layerRef} aria-hidden="true"></div>;
}
