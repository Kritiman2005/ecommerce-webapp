import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    forgotPasswordRequest,
    resetForgotPassword,
} from "../controllers/auth.controller.js";
import {
    registerValidator,
    loginValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from "../validators/auth.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes
router.post("/register", registerValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPasswordRequest);
router.post("/reset-password/:token", resetPasswordValidator, validate, resetForgotPassword);

// Protected routes (require authentication)
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changePasswordValidator, validate, changeCurrentPassword);

export default router;
