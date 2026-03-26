import { IUser } from "./user.types";

export interface JwtUser {
  sub: string;
  role: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export type RegisterOutput = Omit<IUser, "password">;

export interface ILoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: RegisterOutput;
  accessToken: string;
  refreshToken: string;
}

export interface GenerateRefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}
