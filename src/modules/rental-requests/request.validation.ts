import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const createRentalRequestSchema = z.object({
  propertyId: z.string().uuid("Property ID must be a valid UUID"),
});

const updateRequestStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
  ] as const),
});

export const requestValidator = {
  create: validateBody(createRentalRequestSchema),
  updateStatus: validateBody(updateRequestStatusSchema),
};
