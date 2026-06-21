import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import {
    createOrderValidator,
    orderIdValidator,
    updateOrderStatusValidator,
} from "../validators/order.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT, validateUserRole } from "../middlewares/auth.middlewares.js";

const router = Router();

// All order routes require authentication
router.use(verifyJWT);

// User routes
router.post("/", createOrderValidator, validate, createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:orderId", orderIdValidator, validate, getOrderById);

// Admin routes
router.get("/all", validateUserRole(["admin"]), getAllOrders);
router.patch("/:orderId/status", validateUserRole(["admin"]), updateOrderStatusValidator, validate, updateOrderStatus);

export default router;
