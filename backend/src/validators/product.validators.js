import { body, param, query } from "express-validator";

const createProductValidator = [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
];

const updateProductValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Description cannot be empty"),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),
    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
];

const productIdValidator = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
];

const getAllProductsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    query("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("minPrice must be a positive number"),
    query("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("maxPrice must be a positive number"),
];

export {
    createProductValidator,
    updateProductValidator,
    productIdValidator,
    getAllProductsValidator,
};
