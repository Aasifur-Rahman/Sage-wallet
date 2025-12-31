import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleValidationError } from "../helpers/handleValidationError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong!! ${err.message}`;

  let errorSources: any = [];

  // Mongoose duplication error

  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Mongoose Cast error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    message = simplifiedError.message;
  }

  // Zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    message = simplifiedError.message;
  }

  // Mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  const safeError =
    envVars.NODE_ENV === "development"
      ? {
          name: err.name,
          message: err.message,
          code: err.code,
          statusCode,
        }
      : null;

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: safeError,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
