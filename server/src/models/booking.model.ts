import { IBooking } from "@types";
import { SLOT_REGEX } from "@utils";
import mongoose, { Schema } from "mongoose";

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    slot: {
      type: String,
      required: true,
      match: SLOT_REGEX,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ user: 1, date: 1, slot: 1 }, { unique: true });

export default mongoose.model<IBooking>("Booking", bookingSchema, "bookings");
