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
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decodedToken?.role !== "admin") {
      throw new ApiError(401, "Unauthorized request.");
    }

    const room = await Room.findById(decodedToken?._id);

    if (!room) {
      throw new ApiError(401, "Invalid access token");
    }

    req.room = room;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token.");
  }
});

export { verifyJWT };
