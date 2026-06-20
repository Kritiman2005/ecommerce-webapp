import { body, param } from "express-validator";
import { AvailableOrderStatus } from "../utils/constants.js";

const createOrderValidator = [
    body("shippingAddress")
        .trim()
        .notEmpty()
        .withMessage("Shipping address is required"),
];

const orderIdValidator = [
    param("orderId").isMongoId().withMessage("Invalid order ID"),
];

const updateOrderStatusValidator = [
    param("orderId").isMongoId().withMessage("Invalid order ID"),
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(AvailableOrderStatus)
        .withMessage(`Status must be one of: ${AvailableOrderStatus.join(", ")}`),
];

export {
    createOrderValidator,
    orderIdValidator,
    updateOrderStatusValidator,
};
