import { Request, Response } from "express";
import httpStatus from "http-status";

import { BookingService } from "@services";
import { catchAsync } from "@utils";

export class BookingController {
  constructor(private bookingService = new BookingService()) {}

  createBooking = catchAsync(async (req: Request, res: Response) => {
    const result = await this.bookingService.createBooking(req.body);

    return res.status(httpStatus.CREATED).json({
      data: result,
    });
  });
}

export const bookingController = new BookingController();
