import { Router } from "express";
import {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
} from "../controllers/cart.controller.js";
import {
    addToCartValidator,
    updateCartItemValidator,
    removeFromCartValidator,
} from "../validators/cart.validators.js";
import { validate } from "../validators/validate.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// All cart routes are protected
router.use(verifyJWT);

router.get("/", getCart);
router.post("/add/:productId", addToCartValidator, validate, addToCart);
router.patch("/update/:productId", updateCartItemValidator, validate, updateCartItemQuantity);
router.delete("/remove/:productId", removeFromCartValidator, validate, removeFromCart);
router.delete("/clear", clearCart);

export default router;
