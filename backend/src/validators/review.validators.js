import { body, param } from "express-validator";

const createReviewValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    body("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("comment")
        .trim()
        .notEmpty()
        .withMessage("Comment is required"),
];

const productIdValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
];

const reviewIdValidator = [
    param("reviewId").isMongoId().withMessage("Invalid review ID"),
];

export {
    createReviewValidator,
    productIdValidator,
    reviewIdValidator,
};
