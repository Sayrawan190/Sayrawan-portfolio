import jwt from "jsonwebtoken";
import { pool } from "../server/db.js";
import {
  verifyPassword,
  hashPassword,
  signSession,
  setSessionCookie,
  clearSessionCookie,
} from "../server/auth.js";

export async function login(req, res) {
  const { password } = req.body ?? {};
  if (typeof password !== "string" || !password) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const { rows } = await pool.query("SELECT password_hash FROM admin_auth WHERE id = 1");
  const hash = rows[0]?.password_hash;
  if (!hash || !(await verifyPassword(password, hash))) {
    return res.status(401).json({ error: "invalid_password" });
  }

  setSessionCookie(res, signSession());
  res.json({ ok: true });
}

export function logout(req, res) {
  clearSessionCookie(res);
  res.json({ ok: true });
}

// Public: tells the front-end whether a password has ever been set (so it
// can show a first-run "create a password" screen instead of a login form),
// and whether the current cookie (if any) is a valid, un-revoked session.
export async function status(req, res) {
  const { rows } = await pool.query(
    "SELECT password_changed_at FROM admin_auth WHERE id = 1"
  );
  const hasPassword = rows.length > 0;

  let authed = false;
  const token = req.cookies?.dash_session;
  if (token && hasPassword) {
    try {
      const payload = jwt.verify(token, process.env.SESSION_SECRET);
      const changedAt = new Date(rows[0].password_changed_at).getTime();
      authed = payload.iat * 1000 >= changedAt;
    } catch {
      authed = false;
    }
  }

  res.json({ authed, hasPassword });
}

// Public, but only succeeds once: creates the admin password the first time
// the dashboard is opened. Refuses if a password already exists — from then
// on, changing it requires being logged in (see changePassword below).
export async function setup(req, res) {
  const { password, confirmPassword } = req.body ?? {};
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "password_too_short" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "password_mismatch" });
  }

  const { rowCount } = await pool.query("SELECT 1 FROM admin_auth WHERE id = 1");
  if (rowCount > 0) {
    return res.status(409).json({ error: "already_configured" });
  }

  const hash = await hashPassword(password);
  // Truncate to whole seconds so this lines up with the JWT `iat` claim
  // (also whole seconds) — otherwise the token issued a few lines below
  // would immediately look older than password_changed_at and get rejected.
  await pool.query(
    "INSERT INTO admin_auth (id, password_hash, password_changed_at) VALUES (1, $1, date_trunc('second', now()))",
    [hash]
  );

  setSessionCookie(res, signSession());
  res.json({ ok: true });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body ?? {};
  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    return res.status(400).json({ error: "invalid_request" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "password_too_short" });
  }

  const { rows } = await pool.query("SELECT password_hash FROM admin_auth WHERE id = 1");
  const hash = rows[0]?.password_hash;
  if (!hash || !(await verifyPassword(currentPassword, hash))) {
    return res.status(401).json({ error: "wrong_current_password" });
  }

  const newHash = await hashPassword(newPassword);
  await pool.query(
    "UPDATE admin_auth SET password_hash = $1, password_changed_at = date_trunc('second', now()) WHERE id = 1",
    [newHash]
  );

  clearSessionCookie(res);
  res.json({ ok: true });
}
