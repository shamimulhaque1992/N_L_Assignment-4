import {
  PropertyStatus,
  RequestStatus,
  Role,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IGetDashboardStats } from "./admin.interface";

const getDashboardStats = async (): Promise<IGetDashboardStats> => {
  const [
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    availableProperties,
    unavailableProperties,
    totalCategories,
    totalRentalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    completedRequests,
    totalReviews,
    averageRatingResult,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.TENANT } }),
    prisma.user.count({ where: { role: Role.LANDLORD } }),
    prisma.property.count(),
    prisma.property.count({ where: { status: PropertyStatus.AVAILABLE } }),
    prisma.property.count({ where: { status: PropertyStatus.UNAVAILABLE } }),
    prisma.category.count(),
    prisma.rentalRequest.count(),
    prisma.rentalRequest.count({ where: { status: RequestStatus.PENDING } }),
    prisma.rentalRequest.count({ where: { status: RequestStatus.APPROVED } }),
    prisma.rentalRequest.count({ where: { status: RequestStatus.REJECTED } }),
    prisma.rentalRequest.count({ where: { status: RequestStatus.COMPLETED } }),
    prisma.review.count(),
    prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    availableProperties,
    unavailableProperties,
    totalCategories,
    totalRentalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    completedRequests,
    totalReviews,
    averageRating: averageRatingResult._avg.rating || 0,
  };
};

const getAllPropertiesAdmin = async (query: any) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        category: true,
        landlord: {
          omit: { password: true },
          include: { profile: true },
        },
        _count: {
          select: {
            rentalRequests: true,
            reviews: true,
          },
        },
      },
    }),
    prisma.property.count(),
  ]);

  return {
    data: properties,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getAllRentalRequestsAdmin = async (query: any) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const [rentalRequests, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        property: {
          include: {
            category: true,
            landlord: {
              omit: { password: true },
              include: { profile: true },
            },
          },
        },
        tenant: {
          omit: { password: true },
          include: { profile: true },
        },
        payment: true,
      },
    }),
    prisma.rentalRequest.count(),
  ]);

  return {
    data: rentalRequests,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const deletePropertyAdmin = async (propertyId: string) => {
  await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  await prisma.property.delete({
    where: { id: propertyId },
  });

  return { message: "Property deleted successfully by admin" };
};

const deleteReviewAdmin = async (reviewId: string) => {
  await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully by admin" };
};

export const adminService = {
  getDashboardStats,
  getAllPropertiesAdmin,
  getAllRentalRequestsAdmin,
  deletePropertyAdmin,
  deleteReviewAdmin,
};
