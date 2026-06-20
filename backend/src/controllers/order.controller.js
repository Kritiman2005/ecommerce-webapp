import {Order} from "../models/order.models.js";
import {Cart} from "../models/cart.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";


const createOrder = async(req,res) => {
    
    const {shippingAddress} = req.body;

    const cart = await Cart.findOne({addedBy: req.user?._id}).populate("items.product");

    if(!cart || cart.items.length === 0){
        throw new ApiError(400, "Cart is empty, cannot place order");
    }

    const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
    })); 

    const totalAmount = orderItems.reduce((sum,item) => {
        return sum + item.price * item.quantity;
    }, 0);
    
    const order = await Order.create({
        createdBy: req.user?._id,
        items: orderItems,
        shippingAddress,
        totalAmount,
    });

    cart.items = [];

    await cart.save({validateBeforeSave: false});

    return res
        .status(201)
        .json(new ApiResponse(201, { order }, "Order placed successfully"));
};

const getMyOrders = async(req,res) => {
    const orders = await Order.find({createdBy: req.user?._id}).populate("items.product","name image price").sort({createdAt: -1});

    return res
        .status(200)
        .json(new ApiResponse(200, { orders }, "Orders fetched successfully"));
};

const getOrderById = async(req,res) => {
   
    const {orderId} = req.params;

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404, "Order not found");
    }

    return res
           .status(200)
           .json(
             new ApiResponse(
                200,
                {order},
                "Order fetched successfully",
             ),
           );
};

const getAllOrders = async(req,res) => {
    const orders = await Order.aggregate([
        {
            $lookup:{
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
            },
        },
        {
            $unwind: "$createdBy",
        },
        {
           $unwind: "$items",
        },
        {
            $lookup:{
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "items.product",
            },
        },
        {
           $unwind : "$items.product",
        },
        {
            $group: {
                _id : "$_id",
                createdBy: {$first : "$createdBy" },
                items: {$push: "$items"},
                status: {$first: "$status"},
                shippingAddress: { $first: "$shippingAddress" },
                totalAmount: { $first: "$totalAmount" },
                createdAt: { $first: "$createdAt" },
            },
        },
        {
            $project: {
                "createdBy._id": 1,
                "createdBy.username": 1,
                "createdBy.email": 1,
                "items.product.name": 1,
                "items.product.price": 1,
                "items.product.image": 1,
                "items.quantity": 1,
                "items.price": 1,
                status:1,
                shippingAddress: 1,
                totalAmount: 1,
                createdAt: 1,
            },
        },
        {
            $sort : { createdAt: -1},
        },
    ]);

    return res
           .status(200)
           .json(
              new ApiResponse(
                200,
                {orders},
                "All orders fetched successfully",
              ),
           );
};

const updateOrderStatus = async(req,res) => {
    const {orderId} = req.params;
    const{status} = req.body;


    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404, "OrderId is not valid");
    }


    order.status = status ;

    await order.save({validateBeforeSave:false});


    return res
           .status(200)
           .json(
              new ApiResponse(
                200,
                {order},
               "Order Status Updated Successfully",
              ),
           );
};





export {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
}