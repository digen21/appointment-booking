import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import httpStatus from "http-status";
import { MongoError } from "mongodb";

import { Availability, Booking } from "@models";
import { CreateBookingInput, IAvailability, IBooking } from "@types";
import { generateSlots, ServerError } from "@utils";
import mongoose from "mongoose";
import { BaseRepository } from "./base.service";

dayjs.extend(utc);

export class BookingService {
  private bookingRepository: BaseRepository<IBooking>;
  private availabilityRepository: BaseRepository<IAvailability>;
  constructor() {
    this.bookingRepository = new BaseRepository<IBooking>(Booking);
    this.availabilityRepository = new BaseRepository<IAvailability>(
      Availability,
    );
  }

  async createBooking(data: CreateBookingInput) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (dayjs.utc(data.date).isBefore(dayjs.utc().startOf("day"))) {
        throw new ServerError({
          message: "Cannot create availability in the past",
          status: httpStatus.BAD_REQUEST,
        });
      }

      const startOfDay = dayjs.utc(data.date).startOf("day").toDate();

      const availability = await this.availabilityRepository.findOne(
        {
          user: data.user,
          date: startOfDay,
        },
        undefined,
        { session },
      );

      if (!availability)
        throw new ServerError({
          message: `No availability found for the id: ${data.user} for date: ${data.date}`,
          status: httpStatus.NOT_FOUND,
        });

      // 2. Regenerate slots
      const slots = generateSlots(
        availability.startTime,
        availability.endTime,
        30,
      );

      if (!slots.includes(data.slot)) {
        throw new ServerError({
          message: "Invalid slot",
          status: httpStatus.BAD_REQUEST,
        });
      }

      const exists = await this.bookingRepository.findOne(
        {
          user: data.user,
          date: data.date,
          slot: data.slot,
        },
        undefined,
        { session },
      );

      if (exists)
        throw new ServerError({
          message: "Slot already booked",
          status: httpStatus.BAD_REQUEST,
        });
      const createdBooking = await this.bookingRepository.create(data, {
        session,
      });

      await session.commitTransaction();
      session.endSession();
      return createdBooking;
    } catch (error) {
      await session.abortTransaction();

      if (error instanceof MongoError && error.code === 11000) {
        throw new ServerError({
          message: "Slot already booked",
          status: httpStatus.BAD_REQUEST,
        });
      }

      throw error;
    } finally {
      await session.endSession();
    }
  }
}
