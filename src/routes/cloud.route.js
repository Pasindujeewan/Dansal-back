import express from "express";
import { createCloudinaryUploadSignature } from "../controllers/cloudinary.controller.js";

const router = express.Router();

router.get("/signature", createCloudinaryUploadSignature);

export default router;
