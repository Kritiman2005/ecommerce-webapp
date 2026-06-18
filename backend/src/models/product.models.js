import mongoose , { Schema } from "mongoose";


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    image:{
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: `https://placehold.co/200x200`,
            localPath: "",
        },
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
},
{
  timestamps: true,
},
);


export const Product = mongoose.model("Product", productSchema);