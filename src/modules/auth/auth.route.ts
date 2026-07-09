import { Router } from "express";
import { authController } from "./auth.controller";
import { authValidator } from "./auth.validation";

const router = Router();

router.post("/register", authValidator.register, authController.registerUser);
router.post("/login", authValidator.login, authController.login);
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
