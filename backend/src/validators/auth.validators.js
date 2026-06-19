import { body, param } from "express-validator";
import { AvailableUsersRole } from "../utils/constants.js";

const registerValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
];

const changePasswordValidator = [
    body("oldPassword").trim().notEmpty().withMessage("Old password is required"),
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
];

const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
];

const resetPasswordValidator = [
    param("token").trim().notEmpty().withMessage("Reset token is required"),
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
];

const assignRoleValidator = [
    body("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid user ID"),
    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUsersRole)
        .withMessage(`Role must be one of: ${AvailableUsersRole.join(", ")}`),
];

export {
    registerValidator,
    loginValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    assignRoleValidator,
};
