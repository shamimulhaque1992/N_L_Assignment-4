import { Router } from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Tenant routes
router.post(
  "/",
  auth(Role.TENANT),
  requestController.createRentalRequest,
);

router.patch(
  "/:id/cancel",
  auth(Role.TENANT),
  requestController.cancelRentalRequest,
);

// Landlord routes
router.patch(
  "/:id/status",
  auth(Role.LANDLORD),
  requestController.updateRentalRequestStatus,
);

// Tenant and Landlord routes
router.get(
  "/",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  requestController.getAllRentalRequests,
);

router.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  requestController.getSingleRentalRequest,
);

export const requestRoutes = router;
