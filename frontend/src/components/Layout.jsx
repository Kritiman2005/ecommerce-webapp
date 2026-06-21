import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice.js";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";

export default function Layout() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface-dark">
      {/* Navbar */}
      <nav className="bg-surface border-b border-surface-light px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Luxe Store
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="p-2 hover:bg-surface-light rounded-lg transition">
                  <ShoppingCart size={20} />
                </Link>
                <Link to="/my-orders" className="p-2 hover:bg-surface-light rounded-lg transition">
                  <Package size={20} />
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 bg-primary/20 text-primary-light rounded-lg text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} />
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-surface-light rounded-lg transition text-danger"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm hover:bg-surface-light rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-primary hover:bg-primary-dark rounded-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
