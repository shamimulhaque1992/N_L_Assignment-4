export interface ICreateReviewPayload {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface IGetAllReviewsQuery {
  searchTerm?: string;
  propertyId?: string;
  tenantId?: string;
  minRating?: string;
  maxRating?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}
