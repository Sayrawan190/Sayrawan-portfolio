import { Router } from "express";
import { requireAuth } from "../server/auth.js";
import { reset } from "../controllers/reset.controller.js";

const router = Router();

router.post("/reset", requireAuth, reset);

export default router;
