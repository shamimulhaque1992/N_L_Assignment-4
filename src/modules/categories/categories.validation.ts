import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name cannot exceed 255 characters"),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name cannot be empty").max(255).optional(),
});

export const categoriesValidator = {
  create: validateBody(createCategorySchema),
  update: validateBody(updateCategorySchema),
};
