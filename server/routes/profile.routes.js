import { Router } from "express";
import { requireAuth } from "../server/auth.js";
import { updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.put("/profile", requireAuth, updateProfile);

export default router;
