import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

// Participant schema
const participantSchema = Schema({
  displayName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "participant"],
    default: "participant",
  },
  isCardSelected: {
    type: Boolean,
    default: false,
  },
  selectedCard: {
    type: String,
    default: null,
  },
});

// Room schema
const roomSchema = Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    gameName: {
      type: String,
      required: true,
    },
    votingSystem: {
      type: String,
      required: true,
    },
    maxParticipants: {
      type: Number,
      default: 10,
    },
    participants: {
      type: [participantSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["waiting", "ongoing", "finished"],
      default: "waiting",
    },
    average: {
      type: Number,
      default: 0,
    },
    roundCount: {
      type: Number,
      default: 0,
    },
    isCardRevealed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      roomId: this.roomId,
      participantId: this.participants[this.participants.length - 1]._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const Room = mongoose.model("Room", roomSchema);
