import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getLandlordStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const result = await landlordService.getLandlordStats(landlordId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Landlord statistics retrieved successfully",
      data: result,
    });
  },
);

const getMyProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const result = await landlordService.getMyProperties(landlordId, req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getMyRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const result = await landlordService.getMyRentalRequests(
      landlordId,
      req.query,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getMyReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const result = await landlordService.getMyReviews(landlordId, req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getTenantHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const tenantId = req.params.tenantId as string;
    const result = await landlordService.getTenantHistory(
      landlordId,
      tenantId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tenant history retrieved successfully",
      data: result,
    });
  },
);

export const landlordController = {
  getLandlordStats,
  getMyProperties,
  getMyRentalRequests,
  getMyReviews,
  getTenantHistory,
};
