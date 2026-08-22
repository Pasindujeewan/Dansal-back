import express from "express";
import {
  createDansal,
  getDansalById,
  getDansalsInBounds,
  searchDansals,
} from "../controllers/dansal.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyAccessToken, createDansal);

router.get("/get", getDansalsInBounds);
router.get("/get/:dansalId", getDansalById);
router.get("/search", searchDansals);

export default router;
