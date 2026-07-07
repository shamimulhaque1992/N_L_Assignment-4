export interface IGetLandlordStats {
  totalProperties: number;
  availableProperties: number;
  unavailableProperties: number;
  totalRentalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  completedRequests: number;
  totalReviews: number;
  averageRating: number;
}
