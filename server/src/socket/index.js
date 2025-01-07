import cookie from "cookie";
import jwt from "jsonwebtoken";
import { Room } from "../models/room.models.js";
import { ApiError } from "../utils/ApiError.js";
import { RoomEventEnum } from "../constants.js";

const mountJoinRoomEvent = (socket) => {
  socket.on(RoomEventEnum.JOIN_ROOM_EVENT, (roomId) => {
    console.log(`User joined the room 🤝. roomId: ${roomId}`);
    socket.join(roomId);
  });
};

const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    try {
      // Parse the token from cookies or handshake.auth
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      const token = cookies.accessToken || socket.handshake.auth?.token;

      if (!token) {
        throw new ApiError(401, "Unauthorized handshake. Token is missing.");
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

      // Store participant data in socket
      socket.data.participant = participant;

      // Join the participant to their own room
      const currentParticipantId = participant._id.toString();
      socket.join(currentParticipantId);
      socket.emit(RoomEventEnum.CONNECTED_EVENT, {
        message: "Successfully connected.",
        participantId: currentParticipantId,
      });

      console.info("User connected 🗼. participantId:", currentParticipantId);

      // Mount room events
      mountJoinRoomEvent(socket);

      // Handle disconnection
      socket.on(RoomEventEnum.DISCONNECT_EVENT, () => {
        console.info(
          "User disconnected 🚫. participantId:",
          currentParticipantId
        );
        socket.leave(currentParticipantId);
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
