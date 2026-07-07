import { prisma } from "../../lib/prisma";
import { ICreateUserPayload } from "../auth/auth.interface";
import { IUpdateUserPayload } from "./user.interface";

const getAllUsers = async (payload: ICreateUserPayload) => {};
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
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      profile: {
        update: {
          avatar,
          bio,
          phone,
        },
      },
    },
    omit: { password: true },
    include: { profile: true },
  });
};
const deleteUser = async (payload: ICreateUserPayload) => {};
const moderateUsr = async (payload: ICreateUserPayload) => {};

export const userService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  moderateUsr,
};
