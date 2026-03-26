import { Router } from "express";

import { bookingController } from "@controllers";
import { validate } from "@middlewares";
import { bookingValidation } from "@validators";

const bookingRoutes = Router();

// Public routes
bookingRoutes.post(
  "/",
  validate(bookingValidation.createBookingSchema),
  bookingController.createBooking,
);

export default bookingRoutes;
