import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";
import {
    createProductValidator,
    updateProductValidator,
    productIdValidator,
    getAllProductsValidator,
} from "../validators/product.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT, validateUserRole } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes
router.get("/", getAllProductsValidator, validate, getAllProducts);
router.get("/:productId", productIdValidator, validate, getProductById);

// Protected routes (admin only)
router.post("/", verifyJWT, validateUserRole(["admin"]), upload.single("image"), createProductValidator, validate, createProduct);
router.patch("/:productId", verifyJWT, validateUserRole(["admin"]), upload.single("image"), updateProductValidator, validate, updateProduct);
router.delete("/:productId", verifyJWT, validateUserRole(["admin"]), productIdValidator, validate, deleteProduct);

export default router;
