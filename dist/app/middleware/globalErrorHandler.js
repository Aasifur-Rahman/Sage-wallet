"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const handleCastError_1 = require("../helpers/handleCastError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleDuplicateError_1 = require("../helpers/handleDuplicateError");
const handleValidationError_1 = require("../helpers/handleValidationError");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = `Something went wrong!! ${err.message}`;
    let errorSources = [];
    // Mongoose duplication error
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Mongoose Cast error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        message = simplifiedError.message;
    }
    // Zod error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        message = simplifiedError.message;
    }
    // Mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    const safeError = env_1.envVars.NODE_ENV === "development"
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
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
