import Joi from "joi";

import { TIME_REGEX } from "@utils";

export const createAvailabilitySchema = Joi.object({
  body: Joi.object({
    date: Joi.date().required(),

    startTime: Joi.string().pattern(TIME_REGEX).required(),
    endTime: Joi.string().pattern(TIME_REGEX).required(),
  }),
}).custom((value, helpers) => {
  const { startTime, endTime } = value.body || {};
  if (startTime && endTime && startTime >= endTime) {
    return helpers.error("any.invalid");
  }
  return value;
});

export const getAvailabilitySchema = Joi.object({
  query: Joi.object({
    date: Joi.date().required(),
  }),
  params: Joi.object({
    userId: Joi.string().required(),
  }),
});

export const getAvailableDatesSchema = Joi.object({
  params: Joi.object({
    userId: Joi.string().required(),
  }),
});
