import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// All routes require admin authentication
router.get(
  "/dashboard",
  auth(Role.ADMIN),
  adminController.getDashboardStats,
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  adminController.getAllPropertiesAdmin,
);

router.get(
  "/rental-requests",
  auth(Role.ADMIN),
  adminController.getAllRentalRequestsAdmin,
);

router.delete(
  "/properties/:id",
  auth(Role.ADMIN),
  adminController.deletePropertyAdmin,
);

router.delete(
  "/reviews/:id",
  auth(Role.ADMIN),
  adminController.deleteReviewAdmin,
);

export const adminRoutes = router;
