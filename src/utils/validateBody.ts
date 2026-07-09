import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import httpStatus from "http-status";
import AppError from "./AppError";

/**
 * Returns an Express middleware that validates req.body against the given Zod schema.
 * Passes an AppError(400) to next() if validation fails.
 * On success, replaces req.body with the parsed (coerced) data.
 */
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
