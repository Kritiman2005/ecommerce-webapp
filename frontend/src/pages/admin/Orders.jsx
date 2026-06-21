import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../store/slices/orderSlice.js";

export default function Orders() {
  const dispatch = useDispatch();
  const { allOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">All Orders</h1>

      <div className="bg-surface border border-surface-light rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-surface-light">
              <th className="text-left py-3 px-4">Order ID</th>
              <th className="text-left py-3 px-4">Customer</th>
              <th className="text-left py-3 px-4">Items</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr key={order._id} className="border-b border-surface-light/50 hover:bg-surface-light/30">
                <td className="py-3 px-4 font-mono text-xs">#{order._id.slice(-8)}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{order.createdBy?.username || "N/A"}</p>
                    <p className="text-xs text-gray-400">{order.createdBy?.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300">{order.items?.length} items</td>
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
                <td className="py-3 px-4">
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "delivered")}
                      className="px-3 py-1 text-xs bg-success/20 text-success hover:bg-success/30 rounded-lg transition"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allOrders.length === 0 && (
        <p className="text-center text-gray-400 py-12">No orders found</p>
      )}
    </div>
  );
}
