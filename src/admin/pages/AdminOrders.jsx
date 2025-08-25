import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, XCircle } from "lucide-react";
import ConfirmRejectModal from "../../components/ConfirmRejectModal"; // ✅ saxan
const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/admin/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-700 dark:text-gray-200">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0f172a] min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        All Orders
      </h2>

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-[#1e293b] dark:text-white rounded shadow">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#334155] text-sm text-gray-700 dark:text-white">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Phone No.</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.full_name || "N/A"}</td>
                <td className="p-2 border">{order.model_name || "N/A"}</td>
                <td className="p-2 border">{order.quantity}</td>
                <td className="p-2 border">{order.phone_No || "N/A"}</td>
                <td className="p-2 border">{order.address || "N/A"}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">{order.reason || "N/A"}</td>
                <td className="p-2 border">{order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}</td>
                <td className="p-2 flex gap-1 justify-center flex-wrap">
                  {order.status === 'pending' && (
                    <div className="mt-4 flex items-center gap-4">
                      <button 
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          await axios.put(
                            `${API_BASE}/admin/admin/orders/${order.id}/status`,
                            { new_status: "approved" },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          toast.success("Order Approved");
                          fetchOrders();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EC6325] hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        <CheckCircle size={16}/> Approve
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setRejectModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle size={16}/> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmRejectModal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={async (reason) => {
            setLoading(true);
            try {
              const token = localStorage.getItem("token");
              await axios.put(
                `${API_BASE}/admin/admin/orders/${selectedOrderId}/status`,
                { new_status: "rejected", reason,
                  admin_action_time: new Date().toISOString() 
                 },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              toast.success("Order Rejected");
              fetchOrders();
            } catch (err) {
              toast.error("Failed to reject order!");
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>

      {/* ✅ MOBILE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-light dark:bg-dark-light p-4 rounded-lg shadow-md space-y-2 text-dark dark:text-light"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary">Order #{order.id}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : order.status === 'approved' ? 'bg-green-200 text-green-800' : order.status === 'cancelled' ? 'bg-gray-300 text-gray-700' : 'bg-red-200 text-red-800'}`}>
                {order.status}
              </span>
            </div>
            <p><strong>User:</strong> {order.full_name || "N/A"}</p>
            <p><strong>Model:</strong> {order.model_name || "N/A"}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Phone:</strong> {order.phone_No || "N/A"}</p>
            <p><strong>Address:</strong> {order.address || "N/A"}</p>
            <p><strong>Reason:</strong> {order.reason || "-"}</p>
            <p><strong>Created:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : "N/A"}</p>
            
            {order.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    await axios.put(
                      `${API_BASE}/admin/admin/orders/${order.id}/status`,
                      { new_status: "approved" },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success("Order Approved");
                    fetchOrders();
                  }}
                  className="flex-1 bg-[#EC6325] hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16}/> Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setRejectModalOpen(true);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
                >
                   <XCircle size={16}/> Reject
                </button>
              </div>
            )}
          </div>
        ))}
        <ConfirmRejectModal
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={async (reason) => {
            setLoading(true);
            try {
              const token = localStorage.getItem("token");
              await axios.put(
                `${API_BASE}/admin/admin/orders/${selectedOrderId}/status`,
                { new_status: "rejected", reason },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              toast.success("Order Rejected");
              fetchOrders();
            } catch (err) {
              toast.error("Failed to reject order!");
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
    </div>
  );
}
