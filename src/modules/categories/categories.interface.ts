export interface ICreateCategoryPayload {
  name: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
}

export interface IGetAllCategoriesQuery {
  searchTerm?: string;
  name?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}
