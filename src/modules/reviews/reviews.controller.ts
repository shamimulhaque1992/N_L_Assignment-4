import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewsService } from "./reviews.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const result = await reviewsService.createReview(tenantId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: result,
    });
  },
);

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewsService.getAllReviews(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id as string;
    const result = await reviewsService.getSingleReview(reviewId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review retrieved successfully",
      data: result,
    });
  },
);

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id as string;
    const tenantId = req.user?.id as string;
    const result = await reviewsService.updateReview(
      reviewId,
      tenantId,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review updated successfully",
      data: result,
    });
  },
);

const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id as string;
    const tenantId = req.user?.id as string;
    const result = await reviewsService.deleteReview(reviewId, tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review deleted successfully",
      data: result,
    });
  },
);

export const reviewsController = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
