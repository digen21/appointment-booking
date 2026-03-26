import { NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";

const sanitize = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
};

export default sanitize;
