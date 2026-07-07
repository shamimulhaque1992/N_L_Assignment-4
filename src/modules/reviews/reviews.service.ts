import { Prisma } from "../../../generated/prisma/client";
import { RequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateReviewPayload,
  IGetAllReviewsQuery,
  IUpdateReviewPayload,
} from "./reviews.interface";

const createReview = async (
  tenantId: string,
  payload: ICreateReviewPayload,
) => {
  const { propertyId, rating, comment } = payload;

  // Validate rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Verify property exists
  await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  // Check if tenant has a completed rental for this property
  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: RequestStatus.COMPLETED,
    },
  });

  if (!completedRental) {
    throw new Error(
      "You can only review properties where you have completed a rental",
    );
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this property");
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
    include: {
      tenant: {
        omit: { password: true },
        include: { profile: true },
      },
      property: {
        include: {
          category: true,
          landlord: {
            omit: { password: true },
            include: { profile: true },
          },
        },
      },
    },
  });

  return review;
};

const getAllReviews = async (query: IGetAllReviewsQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.ReviewWhereInput[] = [];

  if (query.propertyId) {
    andConditions.push({
      propertyId: query.propertyId,
    });
  }

  if (query.tenantId) {
    andConditions.push({
      tenantId: query.tenantId,
    });
  }

  if (query.minRating || query.maxRating) {
    const ratingCondition: any = {};
    if (query.minRating) {
      ratingCondition.gte = Number(query.minRating);
    }
    if (query.maxRating) {
      ratingCondition.lte = Number(query.maxRating);
    }
    andConditions.push({
      rating: ratingCondition,
    });
  }

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          comment: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          tenant: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          property: {
            title: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { AND: andConditions },
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
            landlord: {
              omit: { password: true },
              include: { profile: true },
            },
          },
        },
      },
    }),
    prisma.review.count({
      where: { AND: andConditions },
    }),
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

const getSingleReview = async (reviewId: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
    include: {
      tenant: {
        omit: { password: true },
        include: { profile: true },
      },
      property: {
        include: {
          category: true,
          landlord: {
            omit: { password: true },
            include: { profile: true },
          },
        },
      },
    },
  });

  return review;
};

const updateReview = async (
  reviewId: string,
  tenantId: string,
  payload: IUpdateReviewPayload,
) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  // Verify the tenant owns this review
  if (review.tenantId !== tenantId) {
    throw new Error("You are not authorized to update this review");
  }

  // Validate rating if provided
  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new Error("Rating must be between 1 and 5");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
    include: {
      tenant: {
        omit: { password: true },
        include: { profile: true },
      },
      property: {
        include: {
          category: true,
          landlord: {
            omit: { password: true },
            include: { profile: true },
          },
        },
      },
    },
  });

  return updatedReview;
};

const deleteReview = async (reviewId: string, tenantId: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId },
  });

  // Verify the tenant owns this review
  if (review.tenantId !== tenantId) {
    throw new Error("You are not authorized to delete this review");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};

export const reviewsService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
