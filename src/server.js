// server.js
//imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// configure
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
