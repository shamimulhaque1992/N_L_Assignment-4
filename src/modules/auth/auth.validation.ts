import { z } from "zod";
import { validateBody } from "../../utils/validateBody";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required").max(20),
  avatar: z.string().min(1, "Avatar URL is required"),
  bio: z.string().optional().default(""),
  role: z.enum(["TENANT", "LANDLORD"] as const).optional().default("TENANT"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const authValidator = {
  register: validateBody(registerSchema),
  login: validateBody(loginSchema),
};
