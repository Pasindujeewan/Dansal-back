import express from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import { getUserProfile } from "../controllers/getUserProfile.js";


const router = express.Router();

router.get("/profile", verifyAccessToken, getUserProfile);

export default router;