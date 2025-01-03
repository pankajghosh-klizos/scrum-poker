import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    votingSystem: {
      type: String,
      lowercase: true,
      trim: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isCardRevealed: {
      type: Boolean,
      default: false,
    },
    average: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
