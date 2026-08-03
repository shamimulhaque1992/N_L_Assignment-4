import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertiesService } from "./properties.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id as string;
    const result = await propertiesService.createProperty(landlordId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: result,
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertiesService.getAllProperties(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);
const getAllMyProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.user?.id as string;
    const result = await propertiesService.getAllMyProperties(
      req.query,
      userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const result = await propertiesService.getSingleProperty(propertyId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrieved successfully",
      data: result,
    });
  },
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const landlordId = req.user?.id as string;
    const userRole = req.user?.role as string;
    const result = await propertiesService.updateProperty(
      propertyId,
      landlordId,
      userRole,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: result,
    });
  },
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id as string;
    const landlordId = req.user?.id as string;
    const userRole = req.user?.role as string;
    const result = await propertiesService.deleteProperty(
      propertyId,
      landlordId,
      userRole,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully",
      data: result,
    });
  },
);

export const propertiesController = {
  createProperty,
  getAllProperties,
  getAllMyProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};
