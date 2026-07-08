import { Router } from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.TENANT), requestController.createRentalRequest);
router.patch(
  "/:id/cancel",
  auth(Role.TENANT),
  requestController.cancelRentalRequest,
);
router.patch(
  "/:id/status",
  auth(Role.LANDLORD),
  requestController.updateRentalRequestStatus,
);
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
