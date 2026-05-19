// server.js
//imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";

// configure
dotenv.config();

// connect to database

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// port
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  console.log(process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
