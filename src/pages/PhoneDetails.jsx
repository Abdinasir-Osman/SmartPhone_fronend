import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneCard from "../components/PhoneCard";
import OrderModal from "../components/OrderModal";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import UserLikeYou from "../components/UserLikeYou";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PhoneDetails() {
  const { model } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [mainPhone, setMainPhone] = useState(null);
  const [relatedPhones, setRelatedPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userLikePhones, setUserLikePhones] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!model) return;
    setLoading(true);

    Promise.allSettled([
      axios.get(`${API_BASE}/recommend/one?model=${encodeURIComponent(model)}`),
      axios.get(`${API_BASE}/recommend/card?model=${encodeURIComponent(model)}&top_n=6`),
      axios.get(`${API_BASE}/recommend/likeYou`)
    ]).then(([mainRes, relatedRes, likeYouRes]) => {
      if (mainRes.status === "fulfilled" && mainRes.value.data && Object.keys(mainRes.value.data).length > 0) {
        setMainPhone(mainRes.value.data);
      } else {
        setMainPhone(null);
      }

      if (relatedRes.status === "fulfilled" && Array.isArray(relatedRes.value.data)) {
        setRelatedPhones(relatedRes.value.data);
      } else {
        setRelatedPhones([]);
      }

      if (likeYouRes.status === "fulfilled" && Array.isArray(likeYouRes.value.data)) {
        setUserLikePhones(likeYouRes.value.data);
      } else {
        setUserLikePhones([]);
      }

      setLoading(false);
    }).catch((err) => {
      console.error("Error in PhoneDetails requests:", err);
      setMainPhone(null);
      setRelatedPhones([]);
      setUserLikePhones([]);
      setLoading(false);
    });
  }, [model]);

  // ✅ Order Now handler
  const handleBuyClick = () => {
    if (!token) {
      toast.error("❌ Please login to place an order.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    setShowModal(true);
  };

  // ✅ Add to Cart handler
  const handleAddToCart = () => {
    if (!token) {
      toast.error("❌ Please login to add to cart.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    addToCart({
      Brand: mainPhone.Brand,
      Model: mainPhone.Model,
      RAM: mainPhone.RAM,
      Storage: mainPhone.Storage,
      Price: mainPhone.Price || 0,
      Image_URL: mainPhone.Image_URL,
    });
    toast.success(`✅ ${mainPhone.Model} added to cart`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10 font-segoe">
      {loading ? (
        <p className="text-center text-dark dark:text-light">🔄 Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <>
          {/* ✅ Main Phone Card */}
          {mainPhone && (
            <div className="w-full max-w-4xl mx-auto p-6 md:p-8 mb-10 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg bg-light dark:bg-dark">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <img
                  src={mainPhone.Image_URL}
                  alt={`${mainPhone.Brand} ${mainPhone.Model}`}
                  className="w-full max-w-xs md:max-w-sm object-contain rounded-lg shadow"
                />
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-dark dark:text-light">
                    {mainPhone.Brand} – {mainPhone.Model}
                  </h2>
                  {mainPhone.formatted_message && (
                    <div className="border-l-4 border-yellow-400 px-4 py-3 rounded shadow-inner bg-yellow-50 dark:bg-gray-800 text-black dark:text-gray-100 mb-4">
                      <pre className="whitespace-pre-wrap font-sans">{mainPhone.formatted_message}</pre>
                    </div>
                  )}
                  {!mainPhone.formatted_message && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-dark dark:text-light mb-4">
                      <p><strong>Price:</strong> ${mainPhone.Price || mainPhone.Selling_Price || 'N/A'}</p>
                      <p><strong>Rating:</strong> {mainPhone.Rating} ⭐</p>
                      <p><strong>RAM:</strong> {mainPhone.RAM}</p>
                      <p><strong>Storage:</strong> {mainPhone.Storage}</p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button onClick={handleBuyClick} className="px-6 py-3 bg-primary dark:bg-primary text-white dark:text-white rounded-full transition hover:bg-dark hover:text-white dark:hover:bg-light dark:hover:text-dark">Order Now</button>
                    <button onClick={handleAddToCart} className="px-6 py-3 bg-primary dark:bg-primary text-white dark:text-white rounded-full transition hover:bg-dark hover:text-white dark:hover:bg-light dark:hover:text-dark">Add to Cart 🛒</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Phones */}
          {relatedPhones.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-6 text-left text-dark dark:text-white">People also viewed these phones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {relatedPhones.map((phone, index) => (
                  <PhoneCard key={index} phone={phone} />
                ))}
              </div>
            </>
          )}

          {/* Like You Phones */}
          {userLikePhones.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-6 mt-12 text-left text-dark dark:text-white">
                Users like you also bought
              </h2>
              <UserLikeYou phones={userLikePhones} />
            </>
          )}
        </>
      )}

      {showModal && (
        <OrderModal
          phone={mainPhone}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
