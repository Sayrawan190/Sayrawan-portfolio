import { Router } from "express";
import { requireAuth } from "../server/auth.js";
import { addSkill, updateSkill, deleteSkill } from "../controllers/skills.controller.js";

const router = Router();

router.post("/skillCategories/:categoryId/skills", requireAuth, addSkill);
router.put("/skillCategories/:categoryId/skills/:skillId", requireAuth, updateSkill);
router.delete("/skillCategories/:categoryId/skills/:skillId", requireAuth, deleteSkill);

export default router;
