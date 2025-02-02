import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Room } from "../models/room.models.js";
import { v4 as uuidv4 } from "uuid";
import { CookieOptions } from "../constants.js";
import calculateAverage from "../utils/calculateAverage.js";
import { emitUpdatedRoom } from "../app.js";

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
    participants: [{ displayName, role: "admin" }],
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
    { $set: { status: "finished" } },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while closing the room.");
  }

  emitUpdatedRoom(updatedRoom.roomId, {
    room: updatedRoom,
    message: "Room closed successfully.",
  });

  return res
    .status(200)
    .clearCookie("accessToken", CookieOptions)
    .json(new ApiResponse(200, "Room closed."));
});

const getRoom = asyncHandler(async (req, res, next) => {
  if (req.room.status === "finished") {
    return next(new ApiError(400, "Room closed."));
  }

  res.status(200).json(
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

  const room = await Room.findOne({ roomId });

  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  if (
    room.status === "finished" ||
    room.participants.length >= room.maxParticipants
  ) {
    throw new ApiError(400, "Cannot join the room.");
  }

  const participant = { displayName, role: "participant" };

  const updatedRoom = await Room.findByIdAndUpdate(
    room._id,
    { $push: { participants: participant }, $set: { status: "ongoing" } },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while joining the room.");
  }

  const { accessToken } = await generateAccessToken(updatedRoom._id);

  emitUpdatedRoom(updatedRoom.roomId, {
    room: updatedRoom,
    message: `${displayName} joined the room.`,
  });

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
    { $pull: { participants: { _id: req.participant._id } } },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while leaving the room.");
  }

  if (updatedRoom.participants.length === 1) {
    updatedRoom.status = "waiting";
    await updatedRoom.save();
  }

  emitUpdatedRoom(updatedRoom.roomId, {
    room: updatedRoom,
    message: `${req.participant.displayName} left the room.`,
  });

  return res
    .status(200)
    .clearCookie("accessToken", CookieOptions)
    .json(new ApiResponse(200, "Room left successfully."));
});

const selectCard = asyncHandler(async (req, res) => {
  const { card } = req.body;

  if (!card) {
    throw new ApiError(400, "Card is required.");
  }

  const updatedRoom = await Room.findOneAndUpdate(
    { _id: req.room._id, "participants._id": req.participant._id },
    {
      $set: {
        "participants.$.selectedCard": card,
        "participants.$.isCardSelected": true,
      },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while selecting the card.");
  }

  emitUpdatedRoom(updatedRoom.roomId, {
    room: updatedRoom,
    message: `${req.participant.displayName} selected a card.`,
  });

  return res.status(200).json(new ApiResponse(200, "Card selected."));
});

const revealCard = asyncHandler(async (req, res) => {
  if (req.participant.role !== "admin") {
    throw new ApiError(403, "Only admin can reveal the card.");
  }

  const average = calculateAverage(req.room.participants);

  const updatedRoom = await Room.findByIdAndUpdate(
    req.room._id,
    {
      $set: {
        average,
        roundCount: req.room.roundCount + 1,
        isCardRevealed: true,
      },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while revealing the card.");
  }

  emitUpdatedRoom(updatedRoom.roomId, {
    room: updatedRoom,
    message: "Cards revealed by the admin.",
  });

  return res.status(200).json(new ApiResponse(200, "Card revealed."));
});

const voteAgain = asyncHandler(async (req, res) => {
  const updatedRoom = await Room.findOneAndUpdate(
    { _id: req.room._id },
    {
      $set: {
        average: 0,
        isCardRevealed: false,
        "participants.$[].selectedCard": null,
        "participants.$[].isCardSelected": false,
      },
    },
    { new: true }
  );

  if (!updatedRoom) {
    throw new ApiError(500, "Something went wrong while voting again.");
  }

  emitUpdatedRoom(updatedRoom.roomId, {
    room: updatedRoom,
    message: "Voting reset for the next round.",
  });

  return res.status(200).json(new ApiResponse(200, "Voted again."));
});

export {
  createRoom,
  closeRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  selectCard,
  revealCard,
  voteAgain,
};
