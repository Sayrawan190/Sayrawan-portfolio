import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const COOKIE_NAME = "dash_session";

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signSession() {
  return jwt.sign({ sub: "admin" }, process.env.SESSION_SECRET, { expiresIn: "30d" });
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "unauthorized" });

  let payload;
  try {
    payload = jwt.verify(token, process.env.SESSION_SECRET);
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }

  const { rows } = await pool.query("SELECT password_changed_at FROM admin_auth WHERE id = 1");
  const changedAt = rows[0]?.password_changed_at ? new Date(rows[0].password_changed_at).getTime() : 0;
  if (payload.iat * 1000 < changedAt) return res.status(401).json({ error: "unauthorized" });

  next();
}
