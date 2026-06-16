import mongoose , { Schema } from "mongoose";


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
},
{
  timestamps: true,
},
);


export const Product = mongoose.model("Product", productSchema);