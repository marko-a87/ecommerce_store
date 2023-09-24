import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server is listening on http://localhost:${PORT}`)
);
