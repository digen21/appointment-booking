import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  phone?: string;
  refreshToken?: string;
  password: string;
  bookingLinkGenerated?: boolean;
  bookingLinkToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
