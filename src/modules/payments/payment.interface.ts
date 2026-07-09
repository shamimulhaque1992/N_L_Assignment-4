export interface ICreatePaymentSessionPayload {
  rentalRequestId: string;
}

export interface IGetAllPaymentsQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  tenantId?: string;
}
