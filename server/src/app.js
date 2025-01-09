import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin:
      process.env.CORS_ORIGIN == "*"
        ? "*"
        : process.env.CORS_ORIGIN?.split(", "),
    credentials: true,
  },
});

app.set("io", io);

// initializeSocketIO(io);

// global middleware
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN == "*"
        ? "*"
        : process.env.CORS_ORIGIN?.split(","),
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
