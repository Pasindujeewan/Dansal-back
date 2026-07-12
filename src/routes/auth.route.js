import express from "express";
import {
  loginUser,
  refreshAuthTokens,
  registerUser,
  verifyCurrentUser,
} from "../controllers/auth.controller.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/protected", verifyAccessToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});
router.post("/refresh", verifyRefreshToken, refreshAuthTokens);
router.get("/me", verifyAccessToken, verifyCurrentUser);

export default router;
