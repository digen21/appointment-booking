import { Express, Request } from "express";
import httpStatus from "http-status";
import passport from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { env } from "@configs";
import { User } from "@models";
import { BaseRepository } from "@services";
import { IUser, JwtUser } from "@types";
import { logger, ServerError } from "@utils";

const { ACCESS_TOKEN_SECRET } = env;

const cookieExtractor = (req: Request) => req?.cookies?.accessToken || null;

const userService = new BaseRepository<IUser>(User);

export default (app: Express) => {
  const options = {
    secretOrKey: ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    passReqToCallback: true as const,
  };

  try {
    passport.use(
      new Strategy(
        options,
        async (_req: Request, payload: JwtUser, done: VerifiedCallback) => {
          try {
            if (!payload) {
              return done(null, false);
            }

            const userId = payload?.sub;
            const user = await userService.findById(userId, {
              password: 0,
              refreshToken: 0,
            });

            return done(null, user || false);
          } catch (error) {
            return done(error as Error, false);
          }
        },
      ),
    );

    app.use(passport.initialize());
  } catch (error) {
    logger.error("Passport Error : ", {
      error,
      context: "Init Passport",
    });

    throw new ServerError({
      message: "Unauthorized",
      status: httpStatus.UNAUTHORIZED,
    });
  }
};
