import {Product} from "../models/product.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import fs from "fs";



const createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;

    const image = req.file
        ? {
              url: `/images/${req.file.filename}`,
              localPath: req.file.path,
          }
        : undefined;

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        createdBy: req.user._id,
        ...(image && { image }),
    });

    const createdProduct = await Product.findById(product._id).populate(
        "createdBy",
        "username email"
    );

    if (!createdProduct) {
        throw new ApiError(500, "Something went wrong while creating the product");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { product: createdProduct },
                "Product has been created successfully"
            )
        );
};

const getAllProducts = async (req, res) => {
    const { name, category, minPrice, maxPrice, page , limit } = req.query;

    const filter = {};

    if (name) {
        filter.name = { $regex: name, $options: "i" };
    }

    if (category) {
        filter.category = category;
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const result = await Product.aggregate([
        {
            $match: filter,
        },
        {
            $lookup: {
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
            $project: {
                name: 1,
                image: 1,
                description: 1,
                price: 1,
                category: 1,
                stock: 1,
                createdAt: 1,
                "createdBy._id": 1,
                "createdBy.username": 1,
                "createdBy.email": 1,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $facet: {
                products: [
                    { $skip: skip },
                    { $limit: Number(limit) },
                ],
                totalCount: [
                    { $count: "count" },
                ],
            },
        },
    ]);

    const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return res.status(200).json(
        new ApiResponse(
            200,
            { products, totalCount, page: Number(page), totalPages },
            "Products fetched successfully"
        )
    );
};


const getProductById = async(req,res) => {
    const {productId} = req.params;

    const product = await Product.findById(productId).populate("createdBy","username email");

    if(!product){
        throw new ApiError(404, "Product Id does not exist");
    }

    return res
           .status(200)
           .json(
            new ApiResponse(
                200,
                {product: product},
                "Product fetched successfully"
            ),
           );
};


const updateProduct = async(req,res) => {
    const {name,price,stock,category,description} = req.body;
    const{productId} = req.params;

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found");
    }

    if(req.file){

        if(product.image.localPath){
            fs.promises.unlink(product.image.localPath).catch((err) => {
                console.log("Error deleting the old image:", err);
            });
        }

        product.image = {
            url: `/images/${req.file.filename}`,
            localPath: req.file.path,
        };
    }


   product.name = name;
   product.description = description;
   product.price = price;
   product.category = category;
   product.stock = stock;


   await product.save({validateBeforeSave:false});


    return res
        .status(200)
        .json(new ApiResponse(200, { product }, "Product updated successfully"));

};

const deleteProduct = async(req,res) => {
    const {productId} = req.params;
    
    const product = await Product.findById(productId);
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    
    if(product.image.localPath){
            fs.promises.unlink(product.image.localPath).catch((err)=>{
                console.log("Error deleting the old image", err);
            });
    }

    await Product.findByIdAndDelete(productId);


    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted successfully"));
  
};


export { createProduct, getAllProducts , getProductById, updateProduct, deleteProduct};



