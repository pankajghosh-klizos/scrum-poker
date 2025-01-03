import mongoose, { Schema } from "mongoose";

// Participant Schema (for each participant's individual data)
const participantSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    vote: {
      type: Number, // Story point vote selected by the participant
      default: null,
      enum: [0, 1, 2, 3, 5, 8, 13, 21], // Possible Scrum Poker card values
    },
  },
  { _id: false }
);

// Room Schema (for the game room itself)
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
    admin: participantSchema, // The admin is explicitly tracked as a participant
    participants: [participantSchema], // All participants in the game
    isCardRevealed: {
      type: Boolean,
      default: false, // Only the admin can change this value
    },
    average: {
      type: Number,
      default: 0, // Store the average of all revealed votes
    },
    status: {
      type: String,
      enum: ["waiting", "ongoing", "finished"],
      default: "waiting", // Room status (waiting for players, ongoing, finished)
    },
    maxParticipants: {
      type: Number,
      default: 10,
    },
    cardsOptions: {
      type: [Number],
      default: [0, 1, 2, 3, 5, 8, 13, 21], // Default Scrum Poker card options
    },
    currentRound: {
      type: Number,
      default: 1, // Track the current round of the game
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
