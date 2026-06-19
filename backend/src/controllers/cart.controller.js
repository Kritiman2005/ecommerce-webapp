import {Cart} from "../models/cart.models.js";
import{Product} from "../models/product.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";


const addToCart = async(req,res) => {
    const{productId,quantity} = req.body;
    
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({addedBy: req.user?._id});

    if(!cart){
        cart = await Cart.create({addedBy: req.user?._id, items: []});
    }


    const existingItem = cart.items.find(
        (item) => item.product.toString() == productId 
    );

//     function(item) {
//     return item.product.toString() === productId;
// }

    if(existingItem){
         
        existingItem.quantity += quantity;
    }

    else{
        cart.items.push({product: productId, quantity});
    }


    await cart.save({validateBeforeSave:false});


    return res
        .status(200)
        .json(new ApiResponse(200, { cart }, "Item added to cart"));
};

const getCart = async(req,res) => {
    
    const cart = await Cart.findOne({addedBy: req.user?._id}).populate("items.product", "name image price description");

    if(!cart){
        throw new ApiError(404, "cart is empty");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { cart }, "Cart fetched successfully"));
};

const updateCartItemQuantity = async(req,res) => {
    const {productId, quantity} = req.body;

    const cart = await  Cart.findOne({addedBy: req.user?._id});

    if(!cart){
        throw new ApiError(404, "cart is empty");
    }

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (!item) {
        throw new ApiError(404, "Item not found in cart");
    }

    item.quantity = quantity;

    await cart.save({validateBeforeSave: false});
   

    return res
           .status(200)
           .json(
              new ApiResponse(
                200,
                {
                    cart,
                },
                "Quantity updated successfully",
              ),
           );
};

const removeFromCart = async(req,res) => {
    
    const {productId} = req.body;

    const cart = await Cart.findOne({addedBy: req.user?._id});

    if(!cart){
        throw new ApiError(404, "Cart does not exist");
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );


    await cart.save({validateBeforeSave: false});


    return res
        .status(200)
        .json(new ApiResponse(200, { cart }, "Item removed from cart"));

};

const clearCart = async(req,res) => {
    const cart = await Cart.findOne({addedBy: req.user?._id});

    if (!cart) {
        throw new ApiError(404, "Cart does not exist");
    }

    cart.items = [];

    await cart.save({validateBeforeSave:false});

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Cart cleared successfully"));
};







export {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
}
