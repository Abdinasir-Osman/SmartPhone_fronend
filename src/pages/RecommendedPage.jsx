import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OrderModal from "../components/OrderModal";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL;

export default function RecommendedPage() {
  const { model } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [phones, setPhones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!model) return;
    axios.get(`${API_BASE}/recommend/card?model=${model}`)
      .then((res) => setPhones(res.data))
      .catch((err) => {
        console.error("Error loading recommended phones:", err);
        setError("❌ No recommendations found.");
      });
  }, [model]);

  const handleBuyClick = (phone) => {
    if (!token) {
      toast.warn("⚠️ Please login to place an order.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    setSelectedPhone(phone);
    setShowModal(true);
  };

  const handleAddToCart = (phone) => {
    if (!token) {
      toast.warn("⚠️ Please login to add to cart.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    addToCart({
      Brand: phone.Brand,
      Model: phone.Model,
      RAM: phone.RAM,
      Storage: phone.Storage,
      Price: phone.Price || 0,
      Image_URL: phone.Image_URL,
    });
    toast.success(`✅ ${phone.Model} added to cart`);
  };

  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!phones.length) return <p className="text-center text-gray-500 mt-10">🔄 Loading recommendations...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 md:p-8 bg-light dark:bg-dark rounded-xl shadow font-segoe">
      <h2 className="text-2xl font-bold mb-6 text-primary">Recommended Phones</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {phones.map((phone, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
            <img src={phone.Image_URL} alt={phone.Model} className="w-32 h-32 object-contain mb-3 rounded" />
            <h3 className="text-lg font-bold mb-1">{phone.Brand} - {phone.Model}</h3>
            <p className="text-gray-500 mb-1">Price: ${phone.Price}</p>
            <p className="text-gray-500 mb-1">RAM: {phone.RAM} | Storage: {phone.Storage}</p>
            <p className="text-gray-500 mb-1">Rating: {phone.Rating} ⭐</p>
            {phone.similarity !== undefined && (
              <p className="text-blue-600 font-semibold mb-1">Similarity: {phone.similarity}</p>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleBuyClick(phone)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-dark"
              >Order Now</button>
              <button
                onClick={() => handleAddToCart(phone)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-dark"
              >Add to Cart 🛒</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && selectedPhone && (
        <OrderModal
          phone={selectedPhone}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
