import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";
import { v4 as uuidv4 } from "uuid";

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

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour in milliseconds
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(201, "Room created successfully.", {
        roomId: room.roomId,
        accessToken,
      })
    );
});

const closeRoom = asyncHandler(async (req, res) => {
  if (req.room)
    await Room.findByIdAndUpdate(
      req.room._id,
      {
        $set: {
          status: "finished",
        },
      },
      { new: true }
    );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "Room closed."));
});

const getRoom = asyncHandler(async (req, res) => {
  if (req.room.status === "finished") {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, "Room closed."));
  }

  const currentParticipant = req.room.participants.find(
    (participant) => participant._id.toString() === req.participantId
  );

  return res.status(200).json(
    new ApiResponse(200, "Room found.", {
      room: req.room,
      participant: currentParticipant,
    })
  );
});

const joinRoom = asyncHandler(async (req, res) => {
  const { displayName, roomId } = req.body;

  if (!displayName || !roomId) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  const room = await Room.findOne({ roomId });

  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  if (room.status === "finished") {
    throw new ApiError(400, "Room has already been closed.");
  }

  const participant = {
    displayName,
    role: "participant",
  };

  const updatedRoom = await Room.findByIdAndUpdate(
    room._id,
    {
      $push: {
        participants: participant,
      },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while joining the room.");
  }

  const { accessToken } = await generateAccessToken(room._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour in milliseconds
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "Room joined successfully.", {
        roomId: updatedRoom.roomId,
        accessToken,
      })
    );
});

export { createRoom, closeRoom, getRoom, joinRoom };
