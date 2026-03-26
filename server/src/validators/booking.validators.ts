import { SLOT_REGEX } from "@utils";
import Joi from "joi";

export const createBookingSchema = Joi.object({
  body: Joi.object({
    user: Joi.string().required(),
    date: Joi.date()
      .min(new Date().setHours(0, 0, 0, 0))
      .required(),
    slot: Joi.string().pattern(SLOT_REGEX).required(),
  }),
});
