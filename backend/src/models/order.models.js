import mongoose , {Schema} from "mongoose";
import { OrderStatusEnum, AvailableOrderStatus } from "../utils/constants";


const orderSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },  
    }
    ],
    status: {
        type: String,
        enum: AvailableOrderStatus,
        default: OrderStatusEnum.PENDING,
    },
    shippingAddress: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
},
{
  timestamps: true,
},
);


export const Order = mongoose.model("Order", orderSchema);