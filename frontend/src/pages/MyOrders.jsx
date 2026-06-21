import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice.js";
import { Package } from "lucide-react";

export default function MyOrders() {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading orders...</div>;
  }

  if (myOrders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="mx-auto text-gray-500 mb-4" />
        <h2 className="text-xl font-medium text-gray-300">No orders yet</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {myOrders.map((order) => (
          <div key={order._id} className="bg-surface border border-surface-light rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400">Order #{order._id.slice(-8)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  order.status === "delivered"
                    ? "bg-success/20 text-success"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.product?.name || "Product"} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-light mt-4 pt-4 flex justify-between">
              <span className="text-sm text-gray-400">Shipping: {order.shippingAddress}</span>
              <span className="font-bold text-primary-light">₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
