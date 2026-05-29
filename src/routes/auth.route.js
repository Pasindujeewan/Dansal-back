import express from "express";
import { registerUser } from "../controllers/userRegister.controller.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";
import { verifyRefreshToken } from "../middleware/verifyRefreshToken.js";
import { userRefreshController } from "../controllers/userRefresh.controller.js";
import { loginUser } from "../controllers/userLogin.controller.js";
import { verifyUser } from "../controllers/verifyUser.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/protected", verifyAccessToken, (req, res) => {
  console.log("verification sucsess");
  res.status(400).json({ message: "Protected route accessed" });
});
router.post("/refresh", verifyRefreshToken, userRefreshController);
router.get("/me", verifyAccessToken, verifyUser);

export default router;
