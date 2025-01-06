import { RoomEventEnum } from "../constants.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";

const initializeSocketIO = (io) => {
  io.on(RoomEventEnum.CONNECTED_EVENT, async (socket) => {
    try {
      // Extract token from the Authorization header
      if (!socket.handshake.headers?.authorization) {
        throw new ApiError(401, "Authorization token is missing.");
      }
      const token = socket.handshake.headers.authorization.replace(
        "Bearer ",
        ""
      );

      // Verify the token and decode the room ID
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
        throw new ApiError(401, "Invalid or expired token.");
      }

      const room = await Room.findById(decodedToken?._id.toString());
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
