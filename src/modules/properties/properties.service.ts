import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ICreatePropertyPayload,
  IGetAllPropertiesQuery,
  IUpdatePropertyPayload,
} from "./properties.interface";

const createProperty = async (
  landlordId: string,
  payload: ICreatePropertyPayload,
) => {
  const { title, description, price, address, amenities, categoryId } =
    payload;

  // Verify category exists
  await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  const property = await prisma.property.create({
    data: {
      title,
      description,
      price,
      address,
      amenities,
      categoryId,
      landlordId,
    },
    include: {
      category: true,
      landlord: {
        omit: { password: true },
        include: { profile: true },
      },
    },
  });

  return property;
};

const getAllProperties = async (query: IGetAllPropertiesQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: {
        contains: query.title,
        mode: "insensitive",
      },
    });
  }

  if (query.address) {
    andConditions.push({
      address: {
        contains: query.address,
        mode: "insensitive",
      },
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.landlordId) {
    andConditions.push({
      landlordId: query.landlordId,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  if (query.minPrice || query.maxPrice) {
    const priceCondition: any = {};
    if (query.minPrice) {
      priceCondition.gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      priceCondition.lte = Number(query.maxPrice);
    }
    andConditions.push({
      price: priceCondition,
    });
  }

  if (query.amenities) {
    const amenitiesArray = JSON.parse(query.amenities as string);
    andConditions.push({
      amenities: {
        hasEvery: amenitiesArray,
      },
    });
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: { AND: andConditions },
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
        reviews: {
          include: {
            tenant: {
              omit: { password: true },
              include: { profile: true },
            },
          },
        },
      },
    }),
    prisma.property.count({
      where: { AND: andConditions },
    }),
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

const getSingleProperty = async (propertyId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
    include: {
      category: true,
      landlord: {
        omit: { password: true },
        include: { profile: true },
      },
      reviews: {
        include: {
          tenant: {
            omit: { password: true },
            include: { profile: true },
          },
        },
      },
    },
  });

  return property;
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  payload: IUpdatePropertyPayload,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  // Verify the landlord owns this property
  if (property.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this property");
  }

  // If categoryId is provided, verify it exists
  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: { id: payload.categoryId },
    });
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: payload,
    include: {
      category: true,
      landlord: {
        omit: { password: true },
        include: { profile: true },
      },
    },
  });

  return updatedProperty;
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  // Verify the landlord owns this property
  if (property.landlordId !== landlordId) {
    throw new Error("You are not authorized to delete this property");
  }

  await prisma.property.delete({
    where: { id: propertyId },
  });

  return { message: "Property deleted successfully" };
};

export const propertiesService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};
