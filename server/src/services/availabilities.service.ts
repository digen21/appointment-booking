import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import httpStatus from "http-status";
import { Types } from "mongoose";

import { Availability, Booking } from "@models";
import { CreateAvailabilityInput, IAvailability, IBooking } from "@types";
import { generateSlots, ServerError } from "@utils";
import { BaseRepository } from "./base.service";

dayjs.extend(utc);

export class AvailabilityService {
  private availabilityRepository: BaseRepository<IAvailability>;
  private bookingRepository: BaseRepository<IBooking>;
  constructor() {
    this.availabilityRepository = new BaseRepository<IAvailability>(
      Availability,
    );
    this.bookingRepository = new BaseRepository<IBooking>(Booking);
  }

  async createAvailability(
    user: Types.ObjectId | string,
    data: CreateAvailabilityInput,
  ) {
    const start = new Date(`${data.date}T${data.startTime}`);
    const end = new Date(`${data.date}T${data.endTime}`);

    if (start >= end)
      throw new ServerError({
        message: "Start time must be less than end time",
        status: httpStatus.BAD_REQUEST,
      });

    const existsAvailability = await this.availabilityRepository.findOne({
      user,
      date: data.date,
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    });

    if (existsAvailability) {
      throw new ServerError({
        message: "Availability is already exists",
        status: httpStatus.CONFLICT,
      });
    }

    return await this.availabilityRepository.create({
      user,
      ...data,
    });
  }

  async getAvailabilitySlots(
    user: Types.ObjectId | string,
    date: Date | string,
  ) {
    const startOfDay = dayjs.utc(date).startOf("day").toDate();
    const endOfDay = dayjs.utc(date).endOf("day").toDate();

    const availabilities = await this.availabilityRepository.find({
      user,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!availabilities.length)
      return {
        date,
        slots: [],
      };

    const slots = availabilities.flatMap((availability) =>
      generateSlots(availability.startTime, availability.endTime, 30),
    );
    const uniqueSlots = Array.from(new Set(slots));

    const bookings = await this.bookingRepository.find({ user, date });

    const bookedSlots = bookings.map((b) => b.slot);
    const availableSlots = uniqueSlots.filter(
      (slot) => !bookedSlots.includes(slot),
    );

    return availableSlots;
  }

  async getAvailableDates(user: Types.ObjectId | string) {
    const startOfToday = dayjs.utc().startOf("day").toDate();

    const dates = await Availability.distinct("date", {
      user,
      date: { $gte: startOfToday },
    });

    const uniqueDates = Array.from(
      new Set(dates.map((d: Date) => dayjs.utc(d).format("YYYY-MM-DD"))),
    ).sort();

    return uniqueDates;
  }
}
