import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import httpStatus from "http-status";

import { connectMongodb, env } from "@configs";
import {
  globalErrorHandler,
  initCors,
  initPassport,
  requestLogger,
  sanitize,
} from "@middlewares";
import useRouter from "@routes";
import { logger } from "@utils";

const app = express();

initCors(app);

app.use(sanitize);

app.use(cookieParser());

app.use(requestLogger);

app.use(express.json());

initPassport(app);

connectMongodb();

app.get("/health", (_: Request, res: Response) =>
  res.status(httpStatus.OK).json({
    status: "up",
  }),
);

useRouter(app);

app.use(globalErrorHandler);

const server = app.listen(env.PORT, () =>
  logger.info(`Server started on port ${env.PORT}`),
);

server.timeout = 30000;
