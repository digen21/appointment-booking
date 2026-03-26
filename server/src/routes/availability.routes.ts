import { Router } from "express";

import { availabilityController } from "@controllers";
import { isAuth, validate } from "@middlewares";
import { availabilityValidation } from "@validators";

const availabilityRoutes = Router();

availabilityRoutes.get(
  "/slots/:userId",
  validate(availabilityValidation.getAvailabilitySchema),
  availabilityController.getSlotAvailability,
);

availabilityRoutes.get(
  "/dates/:userId",
  validate(availabilityValidation.getAvailableDatesSchema),
  availabilityController.getAvailableDates,
);

availabilityRoutes.use(isAuth);
availabilityRoutes.post(
  "/",
  validate(availabilityValidation.createAvailabilitySchema),
  availabilityController.createAvailability,
);

availabilityRoutes.get(
  "/booking-link",
  availabilityController.generateBookingLink,
);

export default availabilityRoutes;
