import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderModal from "./OrderModal";
import SingleOrderModal from "./SingleOrderModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL;

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} color="#FFD700" />); // Full star
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} color="#FFD700" />); // Half star
    } else {
      stars.push(<FaRegStar key={i} color="#FFD700" />); // Empty star
    }
  }
  return stars;
}

export default function PhoneCard({ phone }) {
  const [showModal, setShowModal] = useState(false);
  const [showSingleOrderModal, setShowSingleOrderModal] = useState(false);
  const [fullPhone, setFullPhone] = useState(phone);
  const [imgError, setImgError] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  useEffect(() => {
    // Haddii phone uu horey u dhamaystiran yahay, ma jiro baahi loo qabo in la re-fetch gareeyo.
    // Haddii aad rabto in aad mar walba re-fetch gareyso, uncomment code-ka hoose.
    // const fetchFullPhone = async () => {
    //   try {
    //     const model = encodeURIComponent(phone.Model);
    //     const res = await axios.get(`${API_BASE}/recommend/one?model=${model}`);
    //     setFullPhone(res.data);
    //   } catch (error) {
    //     console.error("Failed to fetch full phone details:", error);
    //   }
    // };
    // fetchFullPhone();
  }, [phone]);

  if (!fullPhone || !fullPhone.Model || !fullPhone.Image_URL) {
    return <p className="text-red-500">❌ Invalid phone data</p>;
  }

  if (imgError) return null;

  const handleBuyClick = () => {
    if (!token) {
      toast.error("❌ Please login to place an order.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    setShowSingleOrderModal(true);
  };

  const handleAddToCart = () => {
    addToCart({
      Brand: fullPhone.Brand,
      Model: fullPhone.Model,
      RAM: fullPhone.RAM,
      Storage: fullPhone.Storage,
      Price: fullPhone.Price || 0,
      Image_URL: fullPhone.Image_URL,
    });
    toast.success(`✅ ${fullPhone.Model} added to cart`);
  };

  return (
    <div
      className="w-full max-w-md mx-auto p-4 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-[#0C2338] font-segoe hover:shadow-xl transition"
    >
      <div 
        className="cursor-pointer"
        onClick={() => navigate(`/phone/${encodeURIComponent(fullPhone.Model)}`)}
      >
        <img
          src={fullPhone.Image_URL}
          alt={fullPhone.Model}
          className="w-full h-48 object-contain mb-3"
          onError={() => setImgError(true)}
        />
        <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
          {fullPhone.Brand} – {fullPhone.Model}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p><strong>Rating:</strong> {fullPhone.Rating ?? "N/A"}
            <span className="inline-flex items-center ml-1">{renderStars(fullPhone.Rating ?? 0)}</span>
          </p>
          <p><strong>Price:</strong> ${fullPhone.Price || "N/A"}</p>
          <p><strong>RAM:</strong> {fullPhone.RAM || "N/A"}</p>
          <p><strong>Storage:</strong> {fullPhone.Storage || "N/A"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex flex-row gap-2">
          <button
            onClick={e => { e.stopPropagation(); handleAddToCart(); }}
            className="w-1/2 px-4 py-2 rounded text-sm font-semibold transition bg-primary text-white hover:bg-dark hover:text-primary dark:hover:bg-light dark:hover:text-dark"
          >
            Add to Cart 🛒
          </button>
          <button
            onClick={e => { e.stopPropagation(); cart.length > 0 ? undefined : handleBuyClick(); }}
            className={`w-1/2 px-4 py-2 rounded text-sm font-semibold transition bg-primary text-white ${cart.length > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark hover:text-primary dark:hover:bg-light dark:hover:text-dark'}`}
            disabled={cart.length > 0}
            title={cart.length > 0 ? 'Clear your cart to order a single phone' : ''}
          >
            Order Now
          </button>
        </div>
      </div>
      {showModal && (
        <OrderModal
          phone={fullPhone}
          onClose={() => setShowModal(false)}
        />
      )}
      
      {showSingleOrderModal && (
        <SingleOrderModal
          phone={fullPhone}
          onClose={() => setShowSingleOrderModal(false)}
        />
      )}
    </div>
  );
}
