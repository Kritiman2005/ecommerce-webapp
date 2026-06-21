import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice.js";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.orders);
  const { cart } = useSelector((state) => state.cart);
  const [shippingAddress, setShippingAddress] = useState("");

  const items = cart?.items || [];
  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrder(shippingAddress)).then((res) => {
      if (!res.error) {
        navigate("/my-orders");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-surface-light rounded-xl p-6 mb-6">
        <h2 className="font-medium mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-gray-300">
                {item.product?.name} × {item.quantity}
              </span>
              <span>₹{(item.product?.price || 0) * item.quantity}</span>
            </div>
          ))}
          <div className="border-t border-surface-light pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary-light">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-surface-light rounded-xl p-6">
        <h2 className="font-medium mb-4">Shipping Address</h2>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter your full shipping address..."
          rows={4}
          className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none resize-none"
          required
        />
        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="w-full mt-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 rounded-lg transition font-medium"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
