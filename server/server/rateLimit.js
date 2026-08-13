// Minimal in-memory, per-IP rate limiter. No Redis/external store — this is
// a single-instance, low-traffic personal site, so a process-local Map is
// enough; counts simply reset on deploy/restart, which is an acceptable
// trade-off here. Not suitable for a multi-instance deployment.
const hits = new Map();

export function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const key = `${req.baseUrl}${req.path}:${req.ip || req.socket?.remoteAddress || "unknown"}`;
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({ error: "too_many_requests" });
    }

    recent.push(now);
    hits.set(key, recent);
    next();
  };
}
