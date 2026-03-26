import mongoose from "mongoose";

import { logger } from "@utils";
import env from "./envVariable";

const { DATABASE_URL } = env;

export default () => {
  try {
    mongoose
      .connect(DATABASE_URL)
      .then(() => {
        logger.info("Connected To Database...");
      })
      .catch((e) =>
        logger.error("Failed To Connect: ", {
          error: e,
          context: "Database connection",
        }),
      );
  } catch (error) {
    logger.error("Error Occurred While connecting database: ", {
      error,
      context: "Connect Database Error",
    });
    process.exit();
  }
};
