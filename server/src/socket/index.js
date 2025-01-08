import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Room } from "../models/room.models.js";
import { ApiError } from "../utils/ApiError.js";
import { RoomEventEnum } from "../constants.js";

const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      // Verify the JWT token
      const { roomId, participantId } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      // Find the room by roomId
      const room = await Room.findOne({ roomId });
      if (!room) {
        throw new ApiError(404, "Room not found.");
      }

      // Find the participant in the room
      const participant = room.participants.find(
        (participant) => participant._id.toString() === participantId
      );

      if (!participant) {
        throw new ApiError(404, "Participant not found.");
      }

      socket.join(room.roomId);

      console.info(
        `User ${participant.displayName} joined room ${room.roomId}`
      );

      socket.on("disconnect", () => {
        console.info(
          `User ${participant.displayName} left room ${room.roomId}`
        );
        socket.leave(room.roomId);
      });
    } catch (error) {
      socket.emit(RoomEventEnum.SOCKET_ERROR_EVENT, {
        message:
          error instanceof ApiError ? error.message : "Internal server error.",
      });
      console.error("Socket connection error:", error);
    }
  });
};

// Emit events to a specific room
const emitSocketEvent = (req, roomId, event, payload) => {
  req.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
