import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { requestService } from "./request.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await requestService.createRentalRequest(tenantId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental request submitted successfully",
      data: result,
    });
  },
);

const getAllRentalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await requestService.getAllRentalRequests(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id as string;
    const result = await requestService.getSingleRentalRequest(requestId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request retrieved successfully",
      data: result,
    });
  },
);

const updateRentalRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id as string;
    const landlordId = req.user?.id as string;
    const result = await requestService.updateRentalRequestStatus(
      requestId,
      landlordId,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request status updated successfully",
      data: result,
    });
  },
);

const cancelRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id as string;
    const tenantId = req.user?.id as string;
    const result = await requestService.cancelRentalRequest(
      requestId,
      tenantId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request cancelled successfully",
      data: result,
    });
  },
);

export const requestController = {
  createRentalRequest,
  getAllRentalRequests,
  getSingleRentalRequest,
  updateRentalRequestStatus,
  cancelRentalRequest,
};
