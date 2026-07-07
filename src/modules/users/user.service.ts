import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IGetAllUsersQuery, IModerateUserPayload, IUpdateUserPayload } from "./user.interface";

const getAllUsers = async (query: IGetAllUsersQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
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

  if (query.email) {
    andConditions.push({
      email: {
        contains: query.email,
        mode: "insensitive",
      },
    });
  }

  if (query.role) {
    andConditions.push({
      role: query.role as any,
    });
  }

  if (query.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { AND: andConditions },
      take: limit,
      skip: skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      omit: { password: true },
      include: { profile: true },
    }),
    prisma.user.count({
      where: { AND: andConditions },
    }),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: { profile: true },
  });
  return user;
};

const updateUser = async (userId: string, payload: IUpdateUserPayload) => {
  const { name, avatar, bio, phone } = payload;
  
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const updateData: Prisma.UserUpdateInput = {};
  
  if (name) {
    updateData.name = name;
  }

  if (avatar || bio || phone) {
    updateData.profile = {
      update: {
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(phone && { phone }),
      },
    };
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    omit: { password: true },
    include: { profile: true },
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
};

const moderateUser = async (userId: string, payload: IModerateUserPayload) => {
  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: payload.status,
    },
    omit: { password: true },
    include: { profile: true },
  });

  return updatedUser;
};

export const userService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  moderateUser,
};
