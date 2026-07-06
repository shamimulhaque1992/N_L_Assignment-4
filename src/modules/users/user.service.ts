import { prisma } from "../../lib/prisma";
import { ICreateUserPayload } from "../auth/auth.interface";

const getAllUsers = async (payload: ICreateUserPayload) => {};
const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: { profile: true },
  });
  return user;
};
const updateUser = async (payload: ICreateUserPayload) => {};
const deleteUser = async (payload: ICreateUserPayload) => {};
const moderateUsr = async (payload: ICreateUserPayload) => {};

export const userService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  moderateUsr,
};
