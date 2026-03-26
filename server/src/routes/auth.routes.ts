import { Router } from "express";

import { authController } from "@controllers";
import { isAuth, validate } from "@middlewares";
import { authValidation } from "@validators";

const authRoutes = Router();

// Public routes
authRoutes.post(
  "/register",
  validate(authValidation.registerSchema),
  authController.register,
);

authRoutes.post(
  "/login",
  // doubleCsrfProtection,
  validate(authValidation.loginSchema),
  authController.login,
);
authRoutes.post("/refresh", authController.refreshToken);

authRoutes.use(isAuth);
authRoutes.get("/profile", authController.profile);
authRoutes.delete("/logout", authController.logout);

export default authRoutes;
