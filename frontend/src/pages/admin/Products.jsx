import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct, deleteProduct } from "../../store/slices/productSlice.js";
import { Plus, Trash2, X } from "lucide-react";

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    dispatch(createProduct(formData)).then((res) => {
      if (!res.error) {
        setShowForm(false);
        setForm({ name: "", description: "", price: "", category: "", stock: "" });
        setImage(null);
      }
    });
  };

  const handleDelete = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-surface-light rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg focus:border-primary focus:outline-none resize-none"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full px-4 py-3 bg-surface-dark border border-surface-light rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white file:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition font-medium"
          >
            Create Product
          </button>
        </form>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-surface border border-surface-light rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-surface-light">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-surface-light/50 hover:bg-surface-light/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image?.url ? `http://localhost:8000${product.image.url}` : "https://placehold.co/40x40"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{product.category}</td>
                  <td className="py-3 px-4 font-medium">₹{product.price}</td>
                  <td className="py-3 px-4">
                    <span className={product.stock > 0 ? "text-success" : "text-danger"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
