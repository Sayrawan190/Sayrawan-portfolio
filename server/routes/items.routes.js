import { Router } from "express";
import { requireAuth } from "../server/auth.js";
import {
  validateListKey,
  addItem,
  updateItem,
  deleteItem,
  reorderItems,
} from "../controllers/items.controller.js";

const router = Router();

router.param("listKey", validateListKey);

router.post("/:listKey/items", requireAuth, addItem);
router.put("/:listKey/items/:id", requireAuth, updateItem);
router.delete("/:listKey/items/:id", requireAuth, deleteItem);
router.put("/:listKey/reorder", requireAuth, reorderItems);

export default router;
