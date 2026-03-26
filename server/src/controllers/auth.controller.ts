import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";

import { AuthService } from "@services";
import { catchAsync, ServerError } from "@utils";
import { env } from "@configs";

const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: !env.IS_DEV,
  sameSite: "strict" as const,
  maxAge,
});

export class AuthController {
  constructor(private authService = new AuthService()) {}

  register = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);

    return res.status(httpStatus.CREATED).json({
      data: result,
    });
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    res.cookie(
      "accessToken",
      result.accessToken,
      getCookieOptions(60 * 60 * 1000),
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      getCookieOptions(7 * 24 * 60 * 60 * 1000),
    );

    return res.status(httpStatus.OK).json({
      data: result,
    });
  });

  refreshToken = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return next(
          new ServerError({
            message: "Missing token",
            status: httpStatus.UNAUTHORIZED,
          }),
        );

      const result = await this.authService.refreshAccessToken(token);

      return res.status(httpStatus.OK).json({
        data: result,
      });
    },
  );

  profile = catchAsync(async (req: Request, res: Response) => {
    return res.status(httpStatus.OK).json({
      data: req.user,
    });
  });

  logout = catchAsync(async (_: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  });
}

export const authController = new AuthController();
