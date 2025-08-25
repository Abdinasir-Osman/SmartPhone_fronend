import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL;

export default function SingleOrderModal({ phone, onClose }) {
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

    // ✅ Form validation
    if (!formData.full_name || !formData.email || !formData.phone_No || !formData.address) {
      toast.error("❌ Please fill all required fields!");
      return;
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("❌ Please enter a valid email address!");
      return;
    }

    // ✅ Phone validation
    if (formData.phone_No.length < 10) {
      toast.error("❌ Please enter a valid phone number!");
      return;
    }

    const sellingPrice = phone.Price || phone.Selling_Price || phone.SellingPrice || 0;
    const total_price = sellingPrice * parseInt(formData.quantity);

    const payload = { ...formData, total_price };

    // ✅ Debug form data
    console.log("Form Data:", formData);
    console.log("Payload:", payload);

    setLoading(true);

    try {
      // ✅ Step 1: Save order to DB
      const res = await axios.post(`${API_BASE}/orders/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Step 2: Save user data for payment
      localStorage.setItem("paymentUserData", JSON.stringify(payload));

      toast.success("✅ Order placed successfully!");

      // ✅ Step 3: Close modal then go to payment
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="flex items-center gap-3">
            <img
              src={phone.Image || phone.image}
              alt={phone.Model || phone.model}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {phone.Model || phone.model}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ${phone.Price || phone.Selling_Price || phone.SellingPrice}
              </p>
            </div>
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                formData.full_name ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
              }`}
              required
              placeholder="Enter your full name"
            />
            {!formData.full_name && (
              <p className="text-red-500 text-xs mt-1">Full name is required</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                formData.email ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
              }`}
              required
              placeholder="Enter your email"
            />
            {!formData.email && (
              <p className="text-red-500 text-xs mt-1">Email is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_No"
              value={formData.phone_No}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                formData.phone_No ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
              }`}
              placeholder="2526xxxxxxx"
              required
            />
            {!formData.phone_No && (
              <p className="text-red-500 text-xs mt-1">Phone number is required</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white ${
                formData.address ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
              }`}
              required
              placeholder="Enter your address"
            />
            {!formData.address && (
              <p className="text-red-500 text-xs mt-1">Address is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Total:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                ${((phone.Price || phone.Selling_Price || phone.SellingPrice) * formData.quantity).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Place Order & Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
} 