import { Types } from "mongoose";

export interface IBooking {
  _id: Types.ObjectId | string;
  user: Types.ObjectId | string;
  date: Date;
  slot: string; // "10:30-11:00"
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingInput {
  user: Types.ObjectId | string;
  date: Date;
  slot: string;
}
