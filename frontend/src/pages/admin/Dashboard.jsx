import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../store/slices/orderSlice.js";
import { fetchProducts } from "../../store/slices/productSlice.js";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { allOrders } = useSelector((state) => state.orders);
  const { totalCount } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({ limit: 1 }));
  }, [dispatch]);

  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const deliveredOrders = allOrders.filter((o) => o.status === "delivered").length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Total Orders",
      value: allOrders.length,
      icon: ShoppingBag,
      color: "text-primary-light",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Products",
      value: totalCount,
      icon: Package,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface border border-surface-light rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-surface border border-surface-light rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-surface-light">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.slice(0, 10).map((order) => (
                <tr key={order._id} className="border-b border-surface-light/50 hover:bg-surface-light/30">
                  <td className="py-3 px-4 font-mono text-xs">#{order._id.slice(-8)}</td>
                  <td className="py-3 px-4">{order.createdBy?.username || "N/A"}</td>
                  <td className="py-3 px-4 font-medium">₹{order.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "delivered"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allOrders.length === 0 && (
          <p className="text-center text-gray-400 py-8">No orders yet</p>
        )}
      </div>
    </div>
  );
}
