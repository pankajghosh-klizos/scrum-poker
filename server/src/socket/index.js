import { RoomEventEnum } from "../constants.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";
import cookie from "cookie";

const initializeSocketIO = (io) => {
  io.on(RoomEventEnum.CONNECTED_EVENT, async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;

      if (!token) {
        token = socket.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const { roomId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const room = await Room.findOne({ roomId });

      if (!room) {
        throw new ApiError(401, "Invalid access token or room not found.");
      }

      // Attach room to socket and join the room
      socket.room = room;
      socket.join(room._id.toString());
      socket.emit(RoomEventEnum.CONNECTED_EVENT);

      console.info(`User connected 🗼 room: ${room._id}`);

      // Handle join room event
      socket.on(RoomEventEnum.JOIN_ROOM_EVENT, (roomId) => {
        console.log(`User joined the room 🤝. roomId: ${roomId}`);
        socket.join(roomId);
      });

      // Handle disconnect event
      socket.on(RoomEventEnum.DISCONNECT_EVENT, () => {
        console.info(`User disconnected 🚫 room: ${socket.room?._id}`);
        if (socket.room) {
          socket.leave(socket.room._id.toString());
        }
      });
    } catch (error) {
      socket.emit("error", {
        message: error?.message || "Socket connection failed.",
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
