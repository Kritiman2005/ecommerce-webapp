import { Router } from "express";
import {
    createReview,
    getProductReviews,
    deleteReview,
} from "../controllers/review.controller.js";
import {
    createReviewValidator,
    productIdValidator,
    reviewIdValidator,
} from "../validators/review.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT, validateUserRole } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public route
router.get("/product/:productId", productIdValidator, validate, getProductReviews);

// Protected routes
router.post("/product/:productId", verifyJWT, createReviewValidator, validate, createReview);
router.delete("/:reviewId", verifyJWT, validateUserRole(["admin"]), reviewIdValidator, validate, deleteReview);

export default router;
