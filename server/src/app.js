import express from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);

// global middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// * api routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import roomRouter from "./routes/room.routes.js";

// * healthcheck
app.use("/api/v1/health", healthcheckRouter);

// * room
app.use("/api/v1/room", roomRouter);

export { httpServer };
