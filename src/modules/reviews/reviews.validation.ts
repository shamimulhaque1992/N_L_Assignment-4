import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const createReviewSchema = z.object({
  propertyId: z.string().uuid("Property ID must be a valid UUID"),
  rating: z
    .number({ error: "Rating must be a number between 1 and 5" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, "Comment is required"),
});

const updateReviewSchema = z.object({
  rating: z
    .number({ error: "Rating must be a number between 1 and 5" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  comment: z.string().min(1, "Comment cannot be empty").optional(),
});

export const reviewsValidator = {
  create: validateBody(createReviewSchema),
  update: validateBody(updateReviewSchema),
};
