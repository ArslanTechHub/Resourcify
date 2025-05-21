import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middlewares/Error.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://resourcify-chi.vercel.app');
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.send(`Backend Working`);
});

import userRoutes from "./routes/userRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
app.use("/api/v1", userRoutes);
app.use("/api/v1", libraryRoutes);
app.use("/api/v1", labRoutes);
app.use("/api/v1", roomRoutes);

app.use(ErrorMiddleware);
export default app;