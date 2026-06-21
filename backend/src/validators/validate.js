import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

/**
 * Middleware that checks for validation errors from express-validator.
 * If errors exist, passes an ApiError to the error handler.
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));

        return next(new ApiError(422, "Validation failed", extractedErrors));
    }

    next();
};
