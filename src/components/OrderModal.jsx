import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL;

export default function OrderModal({ phone, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    model_name: phone.Model || phone.model || "",
    quantity: 1,
    full_name: "",
    email: "",
    phone_No: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.warn("⚠️ Please login first!");
      navigate("/login");
      return;
    }

    const sellingPrice = phone.Price || phone.Selling_Price || phone.SellingPrice || 0;
    const total_price = sellingPrice * parseInt(formData.quantity);

    const payload = { ...formData, total_price };

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/orders/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Save user data for payment
      localStorage.setItem("paymentUserData", JSON.stringify(payload));

      toast.success("✅ Order placed successfully!");

      // ✅ Close modal then go to payment with order_id
      onClose();
      setTimeout(() => {
        navigate(`/checkout?order_id=${res.data.id}`);
      }, 50);

    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      toast.error("❌ Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 font-segoe">
      <div
        className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl sm:rounded-2xl shadow max-w-[95vw] w-full sm:max-w-md mx-2 sm:mx-0"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-[#EC6325]">Place Your Order</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mr-2">Model Name:</label>
            <span className="font-bold text-[#EC6325]">{formData.model_name}</span>
          </div>

          <div>
            <label className="text-sm font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-200"
              min={1}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Phone</label>
            <input
              type="text"
              name="phone_No"
              value={formData.phone_No}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-gray-200"
              required
            ></textarea>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={loading}
              className="
                px-6 py-3
                bg-[#EC6325]
                text-white
                rounded-full transition
                hover:opacity-90
              "
            >
              {loading ? "Submitting..." : "Submit Order"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="
                px-6 py-3
                bg-gray-300 dark:bg-gray-700
                text-black dark:text-white
                rounded-full transition
                hover:bg-gray-400 dark:hover:bg-gray-600
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
