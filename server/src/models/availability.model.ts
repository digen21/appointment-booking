import mongoose from "mongoose";

import { IAvailability } from "@types";
import { TIME_REGEX } from "@utils";

const availabilitySchema = new mongoose.Schema<IAvailability>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: TIME_REGEX,
    },
    endTime: {
      type: String,
      required: true,
      match: TIME_REGEX,
    },
  },
  { timestamps: true },
);

availabilitySchema.index({ user: 1, date: 1 });
export default mongoose.model<IAvailability>(
  "Availability",
  availabilitySchema,
  "availabilities",
);
