import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Room } from "../models/room.models.js";
import { ApiError } from "../utils/ApiError.js";
import { RoomEventEnum } from "../constants.js";

const handleJwtError = (error) => {
  if (error instanceof jwt.TokenExpiredError) {
    return new ApiError(401, "Token expired.");
  }
  if (error instanceof jwt.JsonWebTokenError) {
    return new ApiError(401, "Invalid token.");
  }
  return new ApiError(500, "Token verification failed.");
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw handleJwtError(error);
  }
};

const findRoomAndParticipant = async (roomId, participantId) => {
  const room = await Room.findOne({ roomId });
  if (!room) throw new ApiError(404, "Room not found.");

  const participant = room.participants.find(
    (participant) => participant._id.toString() === participantId
  );

  if (!participant) throw new ApiError(404, "Participant not found.");

  return { room, participant };
};

const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    try {
      // Retrieve the token from cookies or handshake
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let token = cookies?.accessToken || socket.handshake.auth?.token;

      if (!token)
        throw new ApiError(401, "Un-authorized handshake. Token is missing");

      // Verify the token
      const { roomId, participantId } = verifyToken(token);

      // Find the room and participant
      const { room, participant } = await findRoomAndParticipant(
        roomId,
        participantId
      );

      // Join the room
      socket.join(room.gameName);
      socket.emit(RoomEventEnum.CONNECTED_EVENT);

      console.info(
        `User: ${participant.displayName} joined room: ${room.gameName}`
      );

      // Handle disconnection
      socket.on("disconnect", () => {
        console.info(
          `User: ${participant.displayName} left room: ${room.gameName}`
        );
        socket.leave(room.gameName);
      });
    } catch (error) {
      console.error("Socket Error:", error); // Improved logging
      socket.emit(RoomEventEnum.SOCKET_ERROR_EVENT, {
        message:
          error instanceof ApiError ? error.message : "Internal server error.",
      });
    }
  });
};

// Emit events to a specific room
const emitSocketEvent = (req, gameName, event, payload) => {
  req.get("io").in(gameName).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
