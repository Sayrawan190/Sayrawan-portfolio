import { Router } from "express";
import { requireAuth } from "../server/auth.js";
import { rateLimit } from "../server/rateLimit.js";
import { login, logout, status, setup, changePassword } from "../controllers/auth.controller.js";

const router = Router();

// Blunts password brute-forcing on the one public, unauthenticated
// credential-checking endpoint in the app.
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/auth/status", status);
router.post("/auth/setup", setup);
router.post("/change-password", requireAuth, changePassword);

export default router;
