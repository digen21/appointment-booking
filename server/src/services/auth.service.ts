import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { env } from "@configs";
import { User } from "@models";
import {
  GenerateRefreshTokenOutput,
  ILoginInput,
  IUser,
  LoginOutput,
  RegisterInput,
  RegisterOutput,
} from "@types";
import { ServerError } from "@utils";
import { BaseRepository } from "./base.service";

export class AuthService {
  private userRepository: BaseRepository<IUser>;
  constructor() {
    this.userRepository = new BaseRepository<IUser>(User);
  }

  async register(data: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findOne({
      email: data.email.trim().toLowerCase(),
    });

    if (existingUser) {
      throw new ServerError({
        message: "Email already registered",
        status: httpStatus.CONFLICT,
      });
    }

    const userDoc = await this.userRepository.create({
      ...data,
      email: data.email,
    });

    if (!userDoc) {
      throw new ServerError({
        message: "Failed to register",
        status: httpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const createdUser = userDoc.toObject() as IUser;
    // eslint-disable-next-line
    const { password, ...userWithoutPassword } = createdUser;

    return userWithoutPassword;
  }

  async login(data: ILoginInput): Promise<LoginOutput> {
    // Find user by email
    const user = await this.userRepository.findOne(
      {
        email: data.email.toLowerCase(),
      },
      undefined,
    );

    if (!user) {
      throw new ServerError({
        message: "Invalid email or password",
        status: httpStatus.UNAUTHORIZED,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new ServerError({
        message: "Invalid email or password",
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const tokens = await this.generateTokens(user._id.toString());

    // eslint-disable-next-line
    const { password, refreshToken, ...userWithoutPassword } = user.toObject();
    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  private async generateTokens(
    userId: string,
  ): Promise<GenerateRefreshTokenOutput> {
    const accessToken = jwt.sign({ sub: userId }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.REFRESH_EXPIRY_TIME,
    });

    const refreshToken = jwt.sign({ sub: userId }, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_EXPIRY_TIME,
    });

    await this.userRepository.update(
      {
        _id: userId,
      },
      { refreshToken },
      { new: true },
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    const decoded = jwt.verify(oldRefreshToken, env.REFRESH_TOKEN_SECRET) as {
      sub: string;
    };

    const userId = decoded.sub;

    const user = await this.userRepository.findOne(
      { _id: userId },
      { refreshToken: 1 },
    );

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new Error("Invalid refresh token");
    }

    return this.generateTokens(decoded.sub);
  }
}
