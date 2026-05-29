import express from "express";
import { addDansal } from "../controllers/addDansal.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

const router = express.Router();

// Define routes for dansals here
router.post("/add", verifyAccessToken, addDansal);

export default router;
