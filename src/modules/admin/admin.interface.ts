export interface IGetDashboardStats {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  availableProperties: number;
  unavailableProperties: number;
  totalCategories: number;
  totalRentalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  completedRequests: number;
  totalReviews: number;
  averageRating: number;
}
