import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(255).optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

const moderateUserSchema = z.object({
  status: z.enum(["BAN", "UNBAN"] as const, {
    error: "Status must be either BAN or UNBAN",
  }),
});

export const userValidator = {
  update: validateBody(updateUserSchema),
  moderate: validateBody(moderateUserSchema),
};
