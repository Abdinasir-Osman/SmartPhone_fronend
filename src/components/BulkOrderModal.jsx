import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_URL;

export default function BulkOrderModal({ onClose }) {
  const navigate = useNavigate();
  const { cart, clearCart, discount, discountRate, originalTotal, discountedTotal } = useCart();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.Price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // ✅ Use discounted total for payment
  const getFinalTotal = () => {
    return discount > 0 ? discountedTotal : originalTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.warn("⚠️ Please login first!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("❌ Your cart is empty!");
      return;
    }

    if (!formData.full_name || !formData.email || !formData.phone || !formData.address) {
      toast.error("❌ Please fill all required fields!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Step 1: Prepare bulk order payload
      const orderPayload = {
        ...formData,
        total_price: getFinalTotal(), // ✅ Use discounted total
        items: cart.map(item => ({
          phone_id: item.id,
          model_name: item.Model,
          quantity: item.quantity,
        })),
      };

      // ✅ Step 2: Save bulk order to DB
      const { data: createdOrderResponse } = await axios.post(`${API_BASE}/orders/bulk`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Bulk order placed successfully!");

      // ✅ Step 3: Save user data for payment
      localStorage.setItem("paymentUserData", JSON.stringify({
        ...formData,
        total_price: getFinalTotal(), // ✅ Use discounted total
        items: cart,
      }));

      // ✅ Step 4: Close modal then go to payment
      onClose();
      setTimeout(() => {
        navigate(`/checkout?order_id=${createdOrderResponse[0]?.id}`);
      }, 50);

    } catch (err) {
      console.error("Bulk order error:", err.response?.data || err.message);
      toast.error("❌ Failed to place bulk order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 font-segoe">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Bulk Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Cart Items Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Cart Items ({cart.length})</h3>
          <div className="space-y-2">
            {cart.map((item, index) => {
              const price = item.Price || 0;
              return (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.Image_URL}
                      alt={item.Model}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{item.Model}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                    <span className="ml-2 font-medium text-gray-800 dark:text-white">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
            {discount > 0 ? (
              <>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Original:</span>
                  <span>${originalTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                  <span>Discount ({Math.round(discountRate * 100)}%):</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-800 dark:text-white">Total:</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    ${getFinalTotal().toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center font-semibold">
                <span className="text-gray-800 dark:text-white">Total:</span>
                <span className="text-orange-600 dark:text-orange-400">
                  ${getFinalTotal().toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="2526xxxxxxx"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Place Bulk Order & Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
} 