import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import connectDatabase from "./config/database.js";
import dansalRoutes from "./routes/dansal.route.js";
import cloudRoutes from "./routes/cloud.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

connectDatabase();

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/dansals", dansalRoutes);
app.use("/api/cloudinary", cloudRoutes);
app.use("/api/user", userRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
