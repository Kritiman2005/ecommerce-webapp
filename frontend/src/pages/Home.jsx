import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice.js";
import { Search, Filter, Plus } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const { products, totalPages, page, loading } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    dispatch(fetchProducts(params));
  }, [dispatch, filters.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    dispatch(fetchProducts(params));
  };

  return (
    <div>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/create-product"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition"
        >
          <Plus size={18} />
          Create Product
        </Link>
      </div>

      {/* Search and Filters */}
      <form onSubmit={handleSearch} className="mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.name}
            onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-light rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="px-4 py-3 bg-surface border border-surface-light rounded-lg focus:border-primary focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="home">Home</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
          className="w-32 px-4 py-3 bg-surface border border-surface-light rounded-lg focus:border-primary focus:outline-none"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
          className="w-32 px-4 py-3 bg-surface border border-surface-light rounded-lg focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition flex items-center gap-2"
        >
          <Filter size={18} />
          Filter
        </button>
      </form>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading products...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-surface border border-surface-light rounded-xl overflow-hidden hover:border-primary/50 transition group"
              >
                <div className="aspect-square bg-surface-light flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image?.url ? `http://localhost:8000${product.image.url}` : "https://placehold.co/200x200"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white truncate">{product.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{product.category}</p>
                  <p className="text-lg font-bold text-primary-light mt-2">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20 text-gray-400">No products found</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                  className={`px-4 py-2 rounded-lg transition ${
                    pageNum === page
                      ? "bg-primary text-white"
                      : "bg-surface border border-surface-light hover:border-primary"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
