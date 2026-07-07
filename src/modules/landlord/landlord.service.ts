import {
  PropertyStatus,
  RequestStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IGetLandlordStats } from "./landlord.interface";

const getLandlordStats = async (
  landlordId: string,
): Promise<IGetLandlordStats> => {
  const [
    totalProperties,
    availableProperties,
    unavailableProperties,
    totalRentalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    completedRequests,
    totalReviews,
    averageRatingResult,
  ] = await Promise.all([
    prisma.property.count({ where: { landlordId } }),
    prisma.property.count({
      where: { landlordId, status: PropertyStatus.AVAILABLE },
    }),
    prisma.property.count({
      where: { landlordId, status: PropertyStatus.UNAVAILABLE },
    }),
    prisma.rentalRequest.count({
      where: { property: { landlordId } },
    }),
    prisma.rentalRequest.count({
      where: { property: { landlordId }, status: RequestStatus.PENDING },
    }),
    prisma.rentalRequest.count({
      where: { property: { landlordId }, status: RequestStatus.APPROVED },
    }),
    prisma.rentalRequest.count({
      where: { property: { landlordId }, status: RequestStatus.REJECTED },
    }),
    prisma.rentalRequest.count({
      where: { property: { landlordId }, status: RequestStatus.COMPLETED },
    }),
    prisma.review.count({
      where: { property: { landlordId } },
    }),
    prisma.review.aggregate({
      where: { property: { landlordId } },
      _avg: {
        rating: true,
      },
    }),
  ]);

  return {
    totalProperties,
    availableProperties,
    unavailableProperties,
    totalRentalRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    completedRequests,
    totalReviews,
    averageRating: averageRatingResult._avg.rating || 0,
  };
};

const getMyProperties = async (landlordId: string, query: any) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: { landlordId },
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        category: true,
        _count: {
          select: {
            rentalRequests: true,
            reviews: true,
          },
        },
      },
    }),
    prisma.property.count({ where: { landlordId } }),
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

const getMyRentalRequests = async (landlordId: string, query: any) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const [rentalRequests, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: { property: { landlordId } },
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        property: {
          include: {
            category: true,
          },
        },
        tenant: {
          omit: { password: true },
          include: { profile: true },
        },
        payment: true,
      },
    }),
    prisma.rentalRequest.count({ where: { property: { landlordId } } }),
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

const getMyReviews = async (landlordId: string, query: any) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { property: { landlordId } },
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        tenant: {
          omit: { password: true },
          include: { profile: true },
        },
        property: {
          include: {
            category: true,
          },
        },
      },
    }),
    prisma.review.count({ where: { property: { landlordId } } }),
  ]);

  return {
    data: reviews,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getTenantHistory = async (landlordId: string, tenantId: string) => {
  // Verify the landlord has properties
  const landlordProperties = await prisma.property.findMany({
    where: { landlordId },
    select: { id: true },
  });

  if (landlordProperties.length === 0) {
    throw new Error("You don't have any properties");
  }

  const propertyIds = landlordProperties.map((p) => p.id);

  // Get all rental requests from this tenant for landlord's properties
  const rentalHistory = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
      propertyId: { in: propertyIds },
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get all reviews from this tenant for landlord's properties
  const reviewHistory = await prisma.review.findMany({
    where: {
      tenantId,
      propertyId: { in: propertyIds },
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get tenant info
  const tenant = await prisma.user.findUniqueOrThrow({
    where: { id: tenantId },
    omit: { password: true },
    include: { profile: true },
  });

  return {
    tenant,
    rentalHistory,
    reviewHistory,
    totalRentals: rentalHistory.length,
    completedRentals: rentalHistory.filter(
      (r) => r.status === RequestStatus.COMPLETED,
    ).length,
    totalReviews: reviewHistory.length,
  };
};

export const landlordService = {
  getLandlordStats,
  getMyProperties,
  getMyRentalRequests,
  getMyReviews,
  getTenantHistory,
};
