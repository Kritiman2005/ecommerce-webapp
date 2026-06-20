import {Review} from "../models/review.models.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

const createReview = async(req,res) => {
    const {productId} = req.params;
    const {rating , comment} = req.body;
    

    const product = await Product.findById(productId);


    if(!product){
        throw new ApiError(404, "product not found");
    }

    const review = await Review.create({
      createdBy: req.user?._id,
      product: productId,
      rating,
      comment,
    });


    return res
           .status(200)
           .json(
              new ApiResponse(
                 200,
                 {review},
                 "Review Created Successfully",
              ),
           );
};

const getProductReviews = async(req,res) => {
    const {productId} = req.params;

    const product = await Product.findById(productId);


    if(!product){
        throw new ApiError(404, "product not found");
    }

    const reviews = await Review.aggregate([
        {$match : {product : new mongoose.Types.ObjectId(productId) }},
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
            },
        },
        {$unwind: "$createdBy"},
        {
            $project: {
                rating: 1,
                comment: 1,
                createdAt: 1,
                "createdBy._id":1,
                "createdBy.username":1,
            },
        },
        {$sort: {createdAt: -1}},
    ]);

    return res
           .status(200)
           .json(
            new ApiResponse(
              200,
              {reviews},
              "Reviews fetched successfully",
            ),
           );

};

const deleteReview = async(req,res) => {
     
   const {reviewId} = req.params;

   const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

   await Review.findByIdAndDelete(reviewId);

   return res
          .status(200)
          .json(
             new ApiResponse(
               200,
               {},
               "Review deleted successfully",
             ),
          );

};

export {
    createReview,
    getProductReviews,
    deleteReview 
}
