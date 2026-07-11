import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import httpStatus from "http-status";
import AppError from "./AppError";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as ZodError).issues;
      const message = issues
        .map((issue) => `${String(issue.path.join(".")) || "body"}: ${issue.message}`)
        .join(", ");
      return next(new AppError(httpStatus.BAD_REQUEST, message));
    }
    req.body = result.data;
    next();
  };
}
