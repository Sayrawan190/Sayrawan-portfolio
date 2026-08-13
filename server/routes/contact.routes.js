import { Router } from "express";
import { rateLimit } from "../server/rateLimit.js";
import { submitContactMessage } from "../controllers/contact.controller.js";

const router = Router();

// 5 messages per 15 minutes per IP — generous for a real visitor, tight
// enough to blunt a script hammering a public, unauthenticated endpoint.
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.post("/contact", contactLimiter, submitContactMessage);

export default router;
