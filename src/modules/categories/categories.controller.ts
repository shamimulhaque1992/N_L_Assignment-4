import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoriesService } from "./categories.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoriesService.createCategory(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoriesService.getAllCategories(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Categories retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    const result = await categoriesService.getSingleCategory(categoryId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    const result = await categoriesService.updateCategory(categoryId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
  },
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    const result = await categoriesService.deleteCategory(categoryId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully",
      data: result,
    });
  },
);

export const categoriesController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
