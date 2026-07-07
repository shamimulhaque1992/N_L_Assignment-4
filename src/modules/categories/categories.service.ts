import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ICreateCategoryPayload,
  IGetAllCategoriesQuery,
  IUpdateCategoryPayload,
} from "./categories.interface";

const createCategory = async (payload: ICreateCategoryPayload) => {
  const { name } = payload;

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return category;
};

const getAllCategories = async (query: IGetAllCategoriesQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.CategoryWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      name: {
        contains: query.searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (query.name) {
    andConditions.push({
      name: {
        contains: query.name,
        mode: "insensitive",
      },
    });
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: { AND: andConditions },
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
    }),
    prisma.category.count({
      where: { AND: andConditions },
    }),
  ]);

  return {
    data: categories,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleCategory = async (categoryId: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
    include: {
      properties: {
        include: {
          landlord: {
            omit: { password: true },
            include: { profile: true },
          },
        },
      },
      _count: {
        select: {
          properties: true,
        },
      },
    },
  });

  return category;
};

const updateCategory = async (
  categoryId: string,
  payload: IUpdateCategoryPayload,
) => {
  await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: payload,
  });

  return updatedCategory;
};

const deleteCategory = async (categoryId: string) => {
  await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
  });

  // Check if category has properties
  const propertiesCount = await prisma.property.count({
    where: { categoryId },
  });

  if (propertiesCount > 0) {
    throw new Error(
      "Cannot delete category with existing properties. Please reassign or delete properties first.",
    );
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  return { message: "Category deleted successfully" };
};

export const categoriesService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
