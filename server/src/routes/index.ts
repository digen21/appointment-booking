import express, { Express } from "express";

import authRoutes from "./auth.routes";
import availabilityRoutes from "./availability.routes";
import bookingRoutes from "./booking.routes";

const API_PREFIX = "/api";

const useRouter = (app: Express) => {
  const apiRouter = express.Router();

  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/availability", availabilityRoutes);
  apiRouter.use("/book", bookingRoutes);

  app.use(API_PREFIX, apiRouter);
};

export default useRouter;
