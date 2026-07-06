import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    console.log("🚀 ~ userId:", userId);
    const result = await userService.getSingleUser(userId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  },
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const moderateUsr = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const userController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  moderateUsr,
};
