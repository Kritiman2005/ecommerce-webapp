import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, updateCartQuantity, removeFromCart, clearCart } from "../store/slices/cartSlice.js";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={48} className="mx-auto text-gray-500 mb-4" />
        <h2 className="text-xl font-medium text-gray-300">Your cart is empty</h2>
        <Link to="/" className="inline-block mt-4 px-6 py-2 bg-primary rounded-lg hover:bg-primary-dark transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-surface border border-surface-light rounded-xl p-4 flex gap-4">
              <div className="w-24 h-24 bg-surface-light rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product?.image?.url ? `http://localhost:8000${item.product.image.url}` : "https://placehold.co/100x100"}
                  alt={item.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{item.product?.name}</h3>
                <p className="text-primary-light font-bold mt-1">₹{item.product?.price}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() =>
                      dispatch(updateCartQuantity({ productId: item.product._id, quantity: Math.max(1, item.quantity - 1) }))
                    }
                    className="p-1 bg-surface-light rounded hover:bg-primary/20 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(updateCartQuantity({ productId: item.product._id, quantity: item.quantity + 1 }))
                    }
                    className="p-1 bg-surface-light rounded hover:bg-primary/20 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.product._id))}
                className="p-2 text-danger hover:bg-danger/10 rounded-lg transition self-start"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-surface border border-surface-light rounded-xl p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Items ({items.length})</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="border-t border-surface-light pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary-light">₹{totalAmount}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center mt-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition font-medium"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full mt-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
