import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { AvailableUserRoles, UserRolesEnum } from "../constant";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
      required: true,
    },
    isCardSelected: {
      type: Boolean,
      default: false,
    },
    selectedCardNumber: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
