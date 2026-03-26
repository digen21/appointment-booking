import { Types } from "mongoose";

export interface IAvailability {
  _id: Types.ObjectId | string;
  user: Types.ObjectId | string;
  date: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAvailabilityInput {
  date: Date;
  startTime: string;
  endTime: string;
}
