import mongoose, { Schema } from "mongoose";
import {
  RoomEventStatusEnum,
  AvailableRoomEventStatusEnum,
} from "../constant.js";

const participantSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    vote: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const roomSchema = new Schema(
  {
    roomCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    gameName: {
      type: String,
      required: true,
    },
    admin: participantSchema,
    participants: [participantSchema],
    isCardRevealed: {
      type: Boolean,
      default: false,
    },
    average: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [AvailableRoomEventStatusEnum],
      default: RoomEventStatusEnum.WAITING,
    },
    maxParticipants: {
      type: Number,
      default: 10,
    },
    votingSystem: {
      type: [Schema.Types.Mixed],
      default: null,
    },
    currentRound: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
