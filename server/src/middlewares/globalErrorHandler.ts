import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { MongoError } from "mongodb";
import mongoose from "mongoose";

import { logger, ServerError } from "@utils";

const globalErrorHandler = (
  err: Error | ServerError | MongoError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  logger.error("Error : ", {
    context: "Global Error Handler",
    error: err,
  });

  if (err instanceof ServerError) {
    return res
      .status(err.status as number)
      .json({ message: err.message, status: err.status });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: Object.values(err.errors).map((e) => e.message),
      status: httpStatus.BAD_REQUEST,
    });
  }

  if (err instanceof MongoError) {
    return res.status(httpStatus.CONFLICT).json({
      message: "Document already exists",
      status: httpStatus.CONFLICT,
    });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  });
};

export default globalErrorHandler;
