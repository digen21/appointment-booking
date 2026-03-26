import { RequestHandler } from "express";
import httpStatus from "http-status";
import passport, { AuthenticateCallback } from "passport";

const isAuth: RequestHandler = (req, res, next) => {
  const callback: AuthenticateCallback = (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      let message = "Unauthorized";

      if (typeof info === "object" && info !== null && "message" in info) {
        message = (info as { message: string }).message;
      }

      return res.status(httpStatus.UNAUTHORIZED).json({
        message: message || "Unauthorized",
      });
    }

    req.user = user;
    next();
  };

  passport.authenticate("jwt", { session: false }, callback)(req, res, next);
};

export default isAuth;
