import Joi from "joi";

const envValidatorSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_EXPIRY_TIME: Joi.string().required().default("5d"),
  ACCESS_EXPIRY_TIME: Joi.string().required().default("2h"),
  FRONTEND_URL: Joi.string().required(),
}).unknown(true);

export default envValidatorSchema;
