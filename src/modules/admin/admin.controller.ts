import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getDashboardStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getDashboardStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Dashboard statistics retrieved successfully",
      data: result,
    });
  },
);

const getAllPropertiesAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllPropertiesAdmin(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getAllRentalRequestsAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRentalRequestsAdmin(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const deletePropertyAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const result = await adminService.deletePropertyAdmin(propertyId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: result,
    });
  },
);

const deleteReviewAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id as string;
    const result = await adminService.deleteReviewAdmin(reviewId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review deleted successfully",
      data: result,
    });
  },
);

export const adminController = {
  getDashboardStats,
  getAllPropertiesAdmin,
  getAllRentalRequestsAdmin,
  deletePropertyAdmin,
  deleteReviewAdmin,
};
