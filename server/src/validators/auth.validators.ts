import Joi from "joi";

import { EMAIL_REGEX } from "@utils";

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().min(3).max(50).trim(),
    email: Joi.string().required().email().trim().pattern(EMAIL_REGEX),
    password: Joi.string().required().min(8).max(16),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email().trim().pattern(EMAIL_REGEX),
    password: Joi.string().required().min(8).max(16),
  }),
});
