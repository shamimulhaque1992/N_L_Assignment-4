import { RequestStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalRequestPayload {
  propertyId: string;
}

export interface IUpdateRentalRequestStatusPayload {
  status: RequestStatus;
}

export interface IGetAllRentalRequestsQuery {
  searchTerm?: string;
  tenantId?: string;
  propertyId?: string;
  landlordId?: string;
  status?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}
