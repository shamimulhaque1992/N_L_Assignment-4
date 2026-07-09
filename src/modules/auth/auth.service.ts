import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUserPayload, ILoginPayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const registerUser = async (payload: ICreateUserPayload) => {
  const { name, email, password, role, phone, avatar, bio } = payload;
  if (role === "ADMIN") {
    throw new Error("Admin can not be created from this route");
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
      name,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createNewUser = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
      profile: { create: { phone, avatar, bio } },
    },
  });

  const createdNewUser = await prisma.user.findUnique({
    where: { id: createNewUser.id, email: createNewUser.email || email },
    omit: { password: true },
    include: { profile: true },
  });

  return createdNewUser;
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  // check the user exists or not
  const isUserExistsOrNot = await prisma.user.findUniqueOrThrow({
    where: { email },
  });
  // check the password is correct or not
  const isMatchPassword = await bcrypt.compare(
    password,
    isUserExistsOrNot.password,
  );
  if (!isMatchPassword) {
    throw new Error("Password did not match");
  }
  // make payload for jwt
  const userPayload = {
    id: isUserExistsOrNot.id,
    email: isUserExistsOrNot.email,
    name: isUserExistsOrNot.name,
    role: isUserExistsOrNot.role,
  };
  // create access token
  const accessToken = jwtUtils.createToken(
    userPayload,
    config.jwt_access_token_secret,
    config.jwt_access_token_expiry as SignOptions,
  );
  // create refresh token
  const refreshToken = jwtUtils.createToken(
    userPayload,
    config.jwt_refresh_token_secret,
    config.jwt_refresh_token_expiry as SignOptions,
  );
  // send the data in return
  return {
    accessToken,
    refreshToken,
    user: userPayload,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Refresh token not found");
  }
  // verify the token
  const verifiedToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_token_secret,
  );
  if (!verifiedToken) {
    throw new Error("Invalid refresh token");
  }
  // check whether user exits or not
  const { id, name, email, role } = verifiedToken.data as JwtPayload;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new Error("User does not exist");
  }
  // check users current status
  if (user.status === "BAN") {
    throw new Error("User is banned");
  }

  //   create new token
  const jwtPayload = { id, email, name, role };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_token_secret,
    config.jwt_access_token_expiry as SignOptions,
  );

  return {
    accessToken,
  };
};

export const authService = {
  registerUser,
  login,
  refreshToken,
};
