import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice.js";
import { Home, Package, ShoppingBag, LogOut, Settings } from "lucide-react";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Home", icon: Home },
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-surface-light flex flex-col">
        <div className="p-6">
          <Link to="/admin" className="text-xl font-bold text-primary">
            Luxe Analytics
          </Link>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Technical Luxury</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-surface-light"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-light">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-surface-light rounded-lg transition"
          >
            <Settings size={18} />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-surface-light rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-surface border-b border-surface-light px-8 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm">{user?.username}</span>
            <span className="text-xs px-2 py-1 bg-primary/20 text-primary-light rounded">
              Admin
            </span>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
