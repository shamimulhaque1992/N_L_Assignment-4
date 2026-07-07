import { Prisma } from "../../../generated/prisma/client";
import { RequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateRentalRequestPayload,
  IGetAllRentalRequestsQuery,
  IUpdateRentalRequestStatusPayload,
} from "./request.interface";

const createRentalRequest = async (
  tenantId: string,
  payload: ICreateRentalRequestPayload,
) => {
  const { propertyId } = payload;

  // Verify property exists and is available
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.status !== "AVAILABLE") {
    throw new Error("Property is not available for rental");
  }

  // Check if tenant already has a pending or approved request for this property
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: {
        in: [RequestStatus.PENDING, RequestStatus.APPROVED],
      },
    },
  });

  if (existingRequest) {
    throw new Error(
      "You already have an active rental request for this property",
    );
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
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
    },
  });

  return rentalRequest;
};

const getAllRentalRequests = async (query: IGetAllRentalRequestsQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.RentalRequestWhereInput[] = [];

  if (query.tenantId) {
    andConditions.push({
      tenantId: query.tenantId,
    });
  }

  if (query.propertyId) {
    andConditions.push({
      propertyId: query.propertyId,
    });
  }

  if (query.landlordId) {
    andConditions.push({
      property: {
        landlordId: query.landlordId,
      },
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          tenant: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          tenant: {
            email: {
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

  const [rentalRequests, total] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: { AND: andConditions },
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
    prisma.rentalRequest.count({
      where: { AND: andConditions },
    }),
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

const getSingleRentalRequest = async (requestId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
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
  });

  return rentalRequest;
};

const updateRentalRequestStatus = async (
  requestId: string,
  landlordId: string,
  payload: IUpdateRentalRequestStatusPayload,
) => {
  const { status } = payload;

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      property: true,
    },
  });

  // Verify the landlord owns the property
  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error(
      "You are not authorized to update this rental request",
    );
  }

  // Validate status transitions
  if (rentalRequest.status === RequestStatus.COMPLETED) {
    throw new Error("Cannot modify a completed rental request");
  }

  if (rentalRequest.status === RequestStatus.CANCELLED) {
    throw new Error("Cannot modify a cancelled rental request");
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: {
      status,
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
  });

  return updatedRequest;
};

const cancelRentalRequest = async (requestId: string, tenantId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
  });

  // Verify the tenant owns this request
  if (rentalRequest.tenantId !== tenantId) {
    throw new Error("You are not authorized to cancel this rental request");
  }

  // Only pending requests can be cancelled by tenant
  if (rentalRequest.status !== RequestStatus.PENDING) {
    throw new Error("Only pending requests can be cancelled");
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: {
      status: RequestStatus.CANCELLED,
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
    },
  });

  return updatedRequest;
};

export const requestService = {
  createRentalRequest,
  getAllRentalRequests,
  getSingleRentalRequest,
  updateRentalRequestStatus,
  cancelRentalRequest,
};
