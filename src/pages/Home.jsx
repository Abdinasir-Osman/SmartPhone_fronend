import { useEffect, useState } from "react";
import axios from "axios";
import PhoneCard from "../components/PhoneCard";

const API_BASE = import.meta.env.VITE_API_URL;

function PhoneSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/recommend/card?model=${query}`);
      setResults(res.data.slice(0, 5)); // 5 ugu horeeya
    } catch (err) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none"
          placeholder="Search for phones..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-r-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {results.map((phone, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center border hover:shadow-lg transition">
            <img src={phone.Image_URL} alt={phone.Model} className="w-24 h-24 object-contain mb-2" />
            <h3 className="font-bold text-lg mb-1">{phone.Brand} - {phone.Model}</h3>
            <p className="text-gray-500 text-sm mb-1">Price: ${phone.Price}</p>
            <p className="text-gray-500 text-sm mb-1">RAM: {phone.RAM} | Storage: {phone.Storage}</p>
            <p className="text-gray-500 text-sm mb-1">Rating: {phone.Rating} ⭐</p>
            {phone.similarity !== undefined && (
              <p className="text-blue-600 font-semibold text-xs">Similarity: {phone.similarity}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home({ brand }) {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhones = () => {
    const timestamp = Date.now();
    setLoading(true);
    axios
      .get(`${API_BASE}/recommend/phones?refresh=${timestamp}`)
      .then((res) => {
        setPhones(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Phone fetch error:", err);
        setError("Failed to load phones.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const displayPhones = phones;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 font-segoe">
      {/* ✅ HERO SECTION */}
      <section className="
        flex flex-col md:flex-row items-center justify-between
        p-6 md:p-10 rounded-xl shadow-lg mb-12
        bg-light dark:bg-dark border border-gray-200 dark:border-dark
      ">
        <img
          src="iphone.jpg"
          alt="Xaliye Hero"
          className="w-full max-w-xs md:max-w-sm h-auto object-cover rounded-lg mb-6 md:mb-0 shadow-md"
        />
        <div className="md:ml-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dark dark:text-light">
            Discover the Best Phones in Somalia 🇸🇴
          </h1>
          <p className="mb-6 text-dark dark:text-light">
            Shop top brands, AI-powered recommendations & unbeatable prices!
          </p>
          <button
            onClick={() =>
              document.getElementById("phones-section")?.scrollIntoView({ behavior: "smooth" })
            }
            className="
              inline-block bg-primary text-light px-8 py-3 rounded-full
              hover:bg-dark transition duration-300
            "
          >
            Browse Phones Now
          </button>
        </div>
      </section>

      {/* ✅ PHONES SECTION */}
      <h2
        id="phones-section"
        className="text-2xl md:text-3xl font-bold mb-8 text-primary"
      >
        Ready to upgrade? Your dream device is just one click away!
      </h2>

      {/* ✅ Loading / Error / Grid */}
      {loading ? (
        <p className="text-center text-dark dark:text-light">🔄 Loading phones...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : displayPhones.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {displayPhones.map((phone, index) => (
            <PhoneCard key={index} phone={phone} />
          ))}
        </div>
      ) : (
        <p className="text-center text-dark dark:text-light">No phones found.</p>
      )}
    </div>
  );
}
