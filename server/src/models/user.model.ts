import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { IUser } from "@types";
import { EMAIL_REGEX, PHONE_REGEX } from "@utils";

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email address is required"],
      match: [EMAIL_REGEX, "Please fill a valid email address"],
    },
    phone: {
      type: String,
      match: [PHONE_REGEX, "Please add a valid phone number"],
      minLength: 7,
      maxLength: 15,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 16,
    },
    refreshToken: {
      type: String,
    },
    bookingLinkGenerated: {
      type: Boolean,
      default: false,
    },
    bookingLinkToken: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<IUser>("User", UserSchema, "users");
