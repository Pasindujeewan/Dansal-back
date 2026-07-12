import express from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import {
  getUserProfile,
  sendNearbyDansalNotification,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", verifyAccessToken, getUserProfile);
router.post(
  "/notification/check-nearby",
  verifyAccessToken,
  sendNearbyDansalNotification,
);

export default router;
