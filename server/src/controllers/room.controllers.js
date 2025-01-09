import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";
import { v4 as uuidv4 } from "uuid";
import { CookieOptions } from "../constants.js";

const generateAccessToken = async (roomId) => {
  try {
    const room = await Room.findById(roomId);

    const accessToken = room.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token."
    );
  }
};

const createRoom = asyncHandler(async (req, res) => {
  const { displayName, gameName, votingSystem } = req.body;

  if (!displayName || !gameName || !votingSystem) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  const roomId = uuidv4();

  const roomData = {
    roomId,
    gameName,
    votingSystem,
    participants: [
      {
        displayName,
        role: "admin",
      },
    ],
  };

  const room = await Room.create(roomData);

  if (!room) {
    throw new ApiError(500, "Something went wrong while creating the room.");
  }

  const { accessToken } = await generateAccessToken(room._id);

  return res
    .status(201)
    .cookie("accessToken", accessToken, { ...CookieOptions, maxAge: 3600000 })
    .json(
      new ApiResponse(201, "Room created successfully.", {
        roomId: room.roomId,
        accessToken,
      })
    );
});

const closeRoom = asyncHandler(async (req, res) => {
  if (req.participant.role !== "admin") {
    throw new ApiError(403, "Only admin can close the room.");
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    req.room._id,
    {
      $set: {
        status: "finished",
      },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while closing the room.");
  }

  return res
    .status(200)
    .clearCookie("accessToken", CookieOptions)
    .json(new ApiResponse(200, "Room closed."));
});

const getRoom = asyncHandler(async (req, res) => {
  if (req.room.status === "finished") {
    return res
      .status(200)
      .clearCookie("accessToken", CookieOptions)
      .json(new ApiResponse(200, "Room closed."));
  }

  return res.status(200).json(
    new ApiResponse(200, "Room found.", {
      room: req.room,
      participant: req.participant,
    })
  );
});

const joinRoom = asyncHandler(async (req, res) => {
  const { displayName } = req.body;
  const { roomId } = req.params;

  if (!displayName) {
    throw new ApiError(400, "Display name is required.");
  }

  // Find the room by roomId from the URL parameters
  const room = await Room.findOne({ roomId });

  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  if (room.status === "finished") {
    throw new ApiError(400, "Room has already been closed.");
  }

  // Define the participant
  const participant = {
    displayName,
    role: "participant",
  };

  // Update the room by adding the new participant
  const updatedRoom = await Room.findByIdAndUpdate(
    room._id,
    {
      $push: { participants: participant },
      $set: { status: "ongoing" },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while joining the room.");
  }

  // Generate an access token for the participant
  const { accessToken } = await generateAccessToken(updatedRoom._id);

  // Respond with the updated room data
  return res
    .status(200)
    .cookie("accessToken", accessToken, { ...CookieOptions, maxAge: 3600000 })
    .json(
      new ApiResponse(200, "Room joined successfully.", {
        roomId: updatedRoom.roomId,
        accessToken,
      })
    );
});

const leaveRoom = asyncHandler(async (req, res) => {
  const updatedRoom = await Room.findByIdAndUpdate(
    req.room._id,
    {
      $pull: { participants: { _id: req.participant._id } },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while leaving the room.");
  }

  if (updatedRoom.participants.length === 1) {
    updatedRoom.status = "waiting";
    await updatedRoom.save();
  }

  return res
    .status(200)
    .clearCookie("accessToken", CookieOptions)
    .json(new ApiResponse(200, "Room left successfully."));
});

export { createRoom, closeRoom, getRoom, joinRoom, leaveRoom };
