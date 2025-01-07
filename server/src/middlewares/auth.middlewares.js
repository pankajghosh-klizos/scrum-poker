import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request.");
  }

  try {
    const { roomId, participantId } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const room = await Room.findOne({ roomId });

    if (!room) {
      throw new ApiError(401, "Invalid access token");
    }

    req.room = room;
    req.participantId = participantId;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token.");
  }
});

export { verifyJWT };
