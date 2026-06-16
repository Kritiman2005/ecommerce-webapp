import mongoose , {Schema} from "mongoose";


const cartSchema = new Schema ({
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        product: {type: Schema.Types.ObjectId, ref: "Product", required: true},
        quantity: {type: Number, required: true, min: 1},
    }],
},
{
   timestamps: true,
},
);


export const Cart = mongoose.model("Cart",cartSchema);