import { Router } from "express";
import { reviewsController } from "./reviews.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Public routes
router.get("/", reviewsController.getAllReviews);
router.get("/:id", reviewsController.getSingleReview);

// Tenant routes
router.post(
  "/",
  auth(Role.TENANT),
  reviewsController.createReview,
);

router.put(
  "/:id",
  auth(Role.TENANT),
  reviewsController.updateReview,
);

router.delete(
  "/:id",
  auth(Role.TENANT),
  reviewsController.deleteReview,
);

export const reviewsRoutes = router;
