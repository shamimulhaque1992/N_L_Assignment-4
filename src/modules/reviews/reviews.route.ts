import { Router } from "express";
import { reviewsController } from "./reviews.controller";
import { reviewsValidator } from "./reviews.validation";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", reviewsController.getAllReviews);
router.get("/:id", reviewsController.getSingleReview);
router.post("/", auth(Role.TENANT), reviewsValidator.create, reviewsController.createReview);
router.patch("/:id", auth(Role.TENANT), reviewsValidator.update, reviewsController.updateReview);
router.delete("/:id", auth(Role.TENANT), reviewsController.deleteReview);

export const reviewsRoutes = router;
