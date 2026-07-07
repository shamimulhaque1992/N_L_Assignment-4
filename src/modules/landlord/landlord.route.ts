import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// All routes require landlord authentication
router.get(
  "/stats",
  auth(Role.LANDLORD),
  landlordController.getLandlordStats,
);

router.get(
  "/properties",
  auth(Role.LANDLORD),
  landlordController.getMyProperties,
);

router.get(
  "/rental-requests",
  auth(Role.LANDLORD),
  landlordController.getMyRentalRequests,
);

router.get(
  "/reviews",
  auth(Role.LANDLORD),
  landlordController.getMyReviews,
);

router.get(
  "/tenants/:tenantId/history",
  auth(Role.LANDLORD),
  landlordController.getTenantHistory,
);

export const landlordRoutes = router;
