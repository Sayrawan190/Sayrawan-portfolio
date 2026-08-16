// Ten staggered rings pulsing outward from the same center point (0.3s apart
// over a 3s loop) read as a continuous, breathing glow rather than a flat
// spinner — shown full-screen while DataProvider's first /api/data fetch is
// in flight, replacing what used to be plain unstyled "Loading…" text.
export default function LoadingScreen({ text }) {
  return (
    <div className="loadingScreen">
      <div className="loadingPulse" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${(i + 1) * 0.3}s` }}></i>
        ))}
      </div>
      {text && <p className="loadingScreen__text">{text}</p>}
    </div>
  );
}
