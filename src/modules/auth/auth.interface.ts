import { Role } from "../../../generated/prisma/enums";

export interface ILoginPayload {
  email: string;
  password: string;
}
export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  bio: string;
  role: Role;
}
