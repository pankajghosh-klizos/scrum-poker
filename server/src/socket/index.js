import { RoomEventEnum } from "../constants.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";

const initializeSocketIO = (io) => {
  io.on("connection", async (socket) => {
    try {
      // Extract token from the Authorization header
      const token = socket.handshake.headers?.authorization?.replace(
        "Bearer ",
        ""
      );

      if (!token) {
        throw new ApiError(401, "Authorization token is missing.");
      }

      // Verify the token and decode the room ID
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const room = await Room.findById(decodedToken?._id.toString());

      if (!room) {
        throw new ApiError(401, "Invalid access token or room not found.");
      }

      // Attach room to socket and join the room
      socket.room = room;
      socket.join(room._id.toString());
      socket.emit(RoomEventEnum.CONNECTED_EVENT);

      console.info(`User connected 🗼 room: ${room._id}`);

      // Mounting the join room event
      socket.on(RoomEventEnum.JOIN_ROOM_EVENT, (roomId) => {
        console.log(`User joined the room 🤝. roomId: ${roomId}`);
        socket.join(roomId);
      });

      // Handle disconnect event
      socket.on(RoomEventEnum.DISCONNECT_EVENT, () => {
        console.info(`User disconnected 🚫 room: ${room._id}`);
        socket.leave(room._id.toString());
      });
    } catch (error) {
      socket.emit(
        RoomEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
      console.error("Socket connection error:", error);
    }
  });
};

// Emit events to a specific room
const emitSocketEvent = (req, roomId, event, payload) => {
  req.get("io").in(roomId).emit(event, payload);
};

export { initializeSocketIO, emitSocketEvent };
