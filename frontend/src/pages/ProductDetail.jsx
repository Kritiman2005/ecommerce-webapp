import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../store/slices/productSlice.js";
import { addToCart } from "../store/slices/cartSlice.js";
import { fetchProductReviews, createReview } from "../store/slices/reviewSlice.js";
import { Star, ShoppingCart, Minus, Plus } from "lucide-react";

export default function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector((state) => state.products);
  const { reviews } = useSelector((state) => state.reviews);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [cartMessage, setCartMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    dispatch(fetchProductReviews(productId));
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId, quantity })).then((res) => {
      if (!res.error) {
        setCartMessage("Added to cart!");
        setTimeout(() => setCartMessage(null), 2000);
      } else {
        setCartMessage("Failed to add to cart");
        setTimeout(() => setCartMessage(null), 3000);
      }
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    dispatch(createReview({ productId, ...reviewForm }));
    setReviewForm({ rating: 5, comment: "" });
  };

  if (loading || !product) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div>
      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div className="aspect-square bg-surface border border-surface-light rounded-xl overflow-hidden">
          <img
            src={product.image?.url ? `http://localhost:8000${product.image.url}` : "https://placehold.co/400x400"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm text-primary-light uppercase tracking-wider">{product.category}</span>
          <h1 className="text-3xl font-bold text-white mt-2">{product.name}</h1>
          <p className="text-gray-400 mt-4 leading-relaxed">{product.description}</p>
          <p className="text-3xl font-bold text-primary-light mt-6">₹{product.price}</p>
          <p className="text-sm text-gray-400 mt-2">
            {product.stock > 0 ? (
              <span className="text-success">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-surface border border-surface-light rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-surface-light rounded-l-lg transition"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-surface-light rounded-r-lg transition"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || !isAuthenticated}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition font-medium"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-gray-400 mt-3">Please login to add items to cart</p>
          )}

          {cartMessage && (
            <p className={`text-sm mt-3 ${cartMessage.includes("Failed") ? "text-danger" : "text-success"}`}>
              {cartMessage}
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-surface-light pt-8">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        {/* Review Form */}
        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="bg-surface border border-surface-light rounded-xl p-6 mb-8">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                >
                  <Star
                    size={24}
                    className={star <= reviewForm.rating ? "text-warning fill-warning" : "text-gray-500"}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Write your review..."
              rows={3}
              className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-surface border border-surface-light rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{review.createdBy?.username}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= review.rating ? "text-warning fill-warning" : "text-gray-500"}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-gray-300">{review.comment}</p>
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
