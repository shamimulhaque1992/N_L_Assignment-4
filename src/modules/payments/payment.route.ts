import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/webhook", paymentController.handleWebhook);
router.post(
  "/create-intent",
  auth(Role.TENANT),
  paymentController.createPaymentSession,
);
router.get(
  "/",
  auth(Role.TENANT, Role.ADMIN),
  paymentController.getAllPayments,
);
router.get(
  "/:id",
  auth(Role.TENANT, Role.ADMIN),
  paymentController.getSinglePayment,
);

export const paymentRoutes = router;
