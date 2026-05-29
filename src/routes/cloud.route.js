import express from "express";
import generateSignature from "../middleware/generateSignature.js";

const router = express.Router();

router.get("/signature", generateSignature);

export default router;
