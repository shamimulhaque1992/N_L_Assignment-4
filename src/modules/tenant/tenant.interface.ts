export interface IGetTenantStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  activeRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  totalPayments: number;
  totalAmountSpent: number;
  totalReviews: number;
}
