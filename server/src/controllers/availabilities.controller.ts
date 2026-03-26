import { Request, Response } from "express";
import httpStatus from "http-status";
import crypto from "crypto";

import { AvailabilityService, BaseRepository } from "@services";
import { IUser } from "@types";
import { catchAsync, ServerError } from "@utils";
import { User } from "@models";

export class AvailabilityController {
  constructor(
    private availabilityService = new AvailabilityService(),
    private readonly userRepository = new BaseRepository<IUser>(User),
  ) {}

  createAvailability = catchAsync(async (req: Request, res: Response) => {
    const result = await this.availabilityService.createAvailability(
      (req.user as IUser)._id,
      req.body,
    );

    return res.status(httpStatus.CREATED).json({
      data: result,
    });
  });

  generateBookingLink = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as IUser)._id; // from auth middleware

    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const existing = await this.userRepository.findOne({ _id: userId });
    const token =
      existing?.bookingLinkToken || crypto.randomBytes(24).toString("hex");
    if (!existing?.bookingLinkGenerated || !existing?.bookingLinkToken) {
      await this.userRepository.update(
        { _id: userId },
        { bookingLinkGenerated: true, bookingLinkToken: token },
      );
    }

    const link = `/book/${userId}?token=${token}`;

    return res.status(httpStatus.OK).json({
      message: "Booking link generated",
      link,
    });
  });

  getSlotAvailability = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const date = req.query.date as string;
    const token = req.query.token as string | undefined;

    const userExists = await this.userRepository.findOne({ _id: userId });
    if (
      !userExists ||
      !userExists.bookingLinkGenerated ||
      !token ||
      token !== userExists.bookingLinkToken
    ) {
      throw new ServerError({
        message: "Invalid booking link",
        status: httpStatus.NOT_FOUND,
      });
    }

    const slots = await this.availabilityService.getAvailabilitySlots(
      userId,
      date,
    );

    return res.status(httpStatus.OK).json({
      data: { date, slots },
    });
  });

  getAvailableDates = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const token = req.query.token as string | undefined;

    const userExists = await this.userRepository.findOne({ _id: userId });

    if (
      !userExists ||
      !userExists.bookingLinkGenerated ||
      !token ||
      token !== userExists.bookingLinkToken
    ) {
      throw new ServerError({
        message: "Invalid booking link",
        status: httpStatus.NOT_FOUND,
      });
    }

    const dates = await this.availabilityService.getAvailableDates(userId);

    return res.status(httpStatus.OK).json({
      data: { dates },
    });
  });
}

export const availabilityController = new AvailabilityController();
