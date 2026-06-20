import { body, param } from "express-validator";

const addToCartValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),
    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
];

const updateCartItemValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),
    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
];

const removeFromCartValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),
];

export {
    addToCartValidator,
    updateCartItemValidator,
    removeFromCartValidator,
};
