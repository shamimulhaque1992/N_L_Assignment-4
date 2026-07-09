import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const createPaymentSessionSchema = z.object({
  rentalRequestId: z.string().uuid("Rental request ID must be a valid UUID"),
});

export const paymentValidator = {
  createSession: validateBody(createPaymentSessionSchema),
};
