import "dotenv/config";

import { envValidatorSchema } from "@validators";

const { error, value } = envValidatorSchema.validate(process.env);

if (error) throw new Error(`missing env variable ${error.message}`);

const env = {
  PORT: value.PORT,
  NODE_ENV: value.NODE_ENV,
  DATABASE_URL: value.DATABASE_URL,
  ACCESS_TOKEN_SECRET: value.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: value.REFRESH_TOKEN_SECRET,
  REFRESH_EXPIRY_TIME: value.REFRESH_EXPIRY_TIME,
  ACCESS_EXPIRY_TIME: value.ACCESS_EXPIRY_TIME,
  FRONTEND_URL: value.FRONTEND_URL,
  IS_DEV: value.NODE_ENV === "development",
};

export default env;
