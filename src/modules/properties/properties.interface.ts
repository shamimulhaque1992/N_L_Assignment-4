import { PropertyStatus } from "../../../generated/prisma/enums";

export interface ICreatePropertyPayload {
  title: string;
  description: string;
  price: number;
  address: string;
  amenities: string[];
  categoryId: string;
}

export interface IUpdatePropertyPayload {
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  amenities?: string[];
  categoryId?: string;
  status?: PropertyStatus;
}

export interface IGetAllPropertiesQuery {
  searchTerm?: string;
  title?: string;
  address?: string;
  categoryId?: string;
  landlordId?: string;
  status?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}
