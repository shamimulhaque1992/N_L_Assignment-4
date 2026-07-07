import { UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateUserPayload {
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
}

export interface IGetAllUsersQuery {
  searchTerm?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface IModerateUserPayload {
  status: UserStatus;
}
