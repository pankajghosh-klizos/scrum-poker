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

/**
 * socket.io
 */

import { Server } from "socket.io";

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

export const emitUpdatedRoom = (roomId, data) => {
  if (!io) {
    console.error("Socket.IO instance not initialized.");
    return;
  }

  // Emit the updated room data to all clients in the room
  io.to(roomId).emit("roomUpdated", data);
};
