import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tenantService } from "./tenant.services";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const getTenantStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await tenantService.getTenantStats(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tenant statistics retrieved successfully",
      data: result,
    });
  },
);

export const tenantController = {
  getTenantStats,
};
