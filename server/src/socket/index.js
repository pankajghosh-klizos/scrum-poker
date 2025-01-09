import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Room } from "../models/room.models.js";
import { ApiError } from "../utils/ApiError.js";

const participants = {};

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
      let token = socket.handshake.auth?.token;

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
      participants[socket.id] = participant;

      io.in(room.gameName).emit("participants_update_event", {
        participants: Object.values(participants),
      });

      console.info(
        `User: ${participant.displayName} joined room: ${room.gameName}`
      );

      // Handle disconnection
      socket.on("disconnect", () => {
        delete participants[socket.id];
        io.in(room.gameName).emit(
          RoomEventEnum.PARTICIPANTS_UPDATE_EVENT,
          Object.values(participants)
        );
      });

      socket.emit("connected", {
        message: "Connected successfully.",
      });
    } catch (error) {
      socket.emit("socketError", { message: error.message });
    }
  });
};

// Emit events to a specific room
const emitSocketEvent = (req, gameName, event, payload) => {
  req.get("io").in(gameName).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
