import { NextFunction, Request, Response } from "express";

type AsyncHandler<T = unknown> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<T>;

const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (err) {
      next(err);
    }
  };

export default catchAsync;
