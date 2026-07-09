import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({ error: "Price must be a positive number" })
    .positive("Price must be a positive number"),
  address: z.string().min(1, "Address is required").max(255),
  amenities: z.array(z.string()).optional().default([]),
  categoryId: z.string().uuid("Category ID must be a valid UUID"),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"] as const).optional(),
});

const updatePropertySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  price: z
    .number({ error: "Price must be a number" })
    .positive("Price must be a positive number")
    .optional(),
  address: z.string().min(1).max(255).optional(),
  amenities: z.array(z.string()).optional(),
  categoryId: z.string().uuid("Category ID must be a valid UUID").optional(),
  status: z.enum(["AVAILABLE", "UNAVAILABLE"] as const).optional(),
});

export const propertiesValidator = {
  create: validateBody(createPropertySchema),
  update: validateBody(updatePropertySchema),
};
