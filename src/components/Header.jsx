import { Link, useNavigate, NavLink } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaHome } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Bell, Menu, X, Sun, Moon, LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import NotificationDropdown from "./NotificationDropdown";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function Header({ search, setSearch, user, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartItemCount = cart.length;
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) {
      navigate(`/?search=${search}`);
    }
  };

  const fallbackLetter = user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U";

  const cartLink = (
    <Link to="/cart" className="relative flex items-center gap-1 py-2 px-3 rounded-md hover:text-primary transition-colors">
      <FaShoppingCart />
      <span>Cart</span>
      {cartItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {cartItemCount}
        </span>
      )}
    </Link>
  );

  const desktopNavLinks = (
    <>
      <Link to="/" className="py-2 px-3 rounded-md hover:text-primary transition-colors">Home</Link>
      {token && (
        <Link to="/user/dashboard" className="py-2 px-3 rounded-md hover:text-primary transition-colors">Dashboard</Link>
      )}
      {cartLink}
      {!token ? (
        <>
          <Link to="/login" className="py-2 px-3 rounded-md hover:text-primary transition-colors">Login</Link>
          <Link to="/signup" className="py-2 px-3 rounded-md hover:text-primary transition-colors">Sign Up</Link>
        </>
      ) : (
        <button onClick={handleLogout} className="py-2 px-3 rounded-md text-red-400 hover:bg-red-500 hover:text-white transition-colors">
          Logout
        </button>
      )}
    </>
  );

  // Live search handler
  useEffect(() => {
    if (!search || !showResults) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    axios.get(`${API}/recommend/card?model=${search}`)
      .then(res => setSearchResults(res.data.slice(0, 5)))
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, [search, showResults]);

  // Hide results on click outside
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="bg-dark text-light shadow-md sticky top-0 z-40 font-segoe">
      <div className="max-w-7xl mx-auto px-4">
        {/* --- Main Header container --- */}
        <div className="flex items-center justify-between py-4">
          
          {/* --- Left Side --- */}
          <div className="flex items-center gap-4">
            {/* Desktop Logo */}
            <div className="hidden md:flex flex-shrink-0">
              <Link to="/" className="text-2xl font-extrabold text-primary">
                Xaliye <span className="text-light">Phones</span>
              </Link>
            </div>
            {/* Mobile View: Menu, Welcome/Logo */}
            <div className="md:hidden flex items-center gap-3">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-light"><Menu size={24} /></button>
              
              {token && user ? (
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-light">
                      Welcome,<br />
                      <span className="text-primary">{user.full_name}</span>
                    </h1>
                    <p className="text-sm text-gray-400">User Dashboard</p>
                  </div>
                </div>
              ) : (
                <Link to="/" className="text-xl font-extrabold text-primary">Xaliye <span className="text-light">Phones</span></Link>
              )}
            </div>
          </div>
          
          {/* --- Center: Desktop Search --- */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <form onSubmit={handleSearch} className="w-full max-w-md" ref={searchRef} autoComplete="off">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
                  placeholder="Search for phones..."
                  className="w-full px-4 py-2 text-light bg-dark border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  onFocus={() => setShowResults(true)}
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-4 text-light hover:text-primary">
                  <FaSearch />
                </button>
                {/* Search Results Dropdown */}
                {showResults && search && (
                  <div className="absolute left-0 w-full bg-white text-dark rounded-b-xl shadow-lg mt-1 z-[9999] max-h-96 overflow-y-auto pointer-events-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((phone, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer last:border-b-0"
                          onMouseDown={() => {
                            setShowResults(false);
                            setSearch("");
                            navigate(`/phone/${encodeURIComponent(phone.Model)}`);
                          }}
                        >
                          <img src={phone.Image_URL} alt={phone.Model} className="w-12 h-12 object-contain rounded" />
                          <div className="flex-1">
                            <div className="font-bold">{phone.Brand} - {phone.Model}</div>
                            <div className="text-xs text-gray-500">Price: ${phone.Price} | RAM: {phone.RAM} | Storage: {phone.Storage}</div>
                            <div className="text-xs text-blue-600">Similarity: {phone.similarity}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No results found.</div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* --- Right Side (Icons) --- */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              {desktopNavLinks}
            </div>
            
            {/* Common Icons */}
            <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 flex items-center justify-center rounded-full transition border-2 ${darkMode ? 'border-primary text-yellow-500' : 'border-gray-400' } hover:border-primary`}>
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            {token && (
              <>
                <NotificationDropdown userId={user?.id} />
                <button onClick={() => navigate('/user/profile')} className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary">
                  {user?.profile_image ? (
                    <img
                      src={
                        user.profile_image.startsWith('http')
                          ? user.profile_image
                          : `${API}${user.profile_image}`
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary text-light flex items-center justify-center font-semibold">{fallbackLetter}</div>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- Mobile: Search bar --- */}
        <div className="md:hidden pb-4 pt-4">
          <form onSubmit={handleSearch} className="w-full" ref={searchRef} autoComplete="off">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
                placeholder="Search for phones..."
                className="w-full px-4 py-2 text-light bg-dark border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                onFocus={() => setShowResults(true)}
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-4 text-light hover:text-primary">
                <FaSearch />
              </button>
              {/* Search Results Dropdown */}
              {showResults && search && (
                <div className="absolute left-0 w-full bg-white text-dark rounded-b-xl shadow-lg mt-1 z-[9999] max-h-96 overflow-y-auto pointer-events-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((phone, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer last:border-b-0"
                        onMouseDown={() => {
                          setShowResults(false);
                          setSearch("");
                          navigate(`/phone/${encodeURIComponent(phone.Model)}`);
                        }}
                      >
                        <img src={phone.Image_URL} alt={phone.Model} className="w-12 h-12 object-contain rounded" />
                        <div className="flex-1">
                          <div className="font-bold">{phone.Brand} - {phone.Model}</div>
                          <div className="text-xs text-gray-500">Price: ${phone.Price} | RAM: {phone.RAM} | Storage: {phone.Storage}</div>
                          <div className="text-xs text-blue-600">Similarity: {phone.similarity}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found.</div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsMenuOpen(false)}></div>
        <aside className="relative w-72 h-full bg-dark p-4 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="text-xl font-extrabold text-primary">
              Xaliye <span className="text-light">Phones</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="text-light"><X size={24} /></button>
          </div>
          <nav className="flex flex-col gap-3">
            {token ? (
              <>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-3 text-light rounded-md transition-colors ${isActive ? 'bg-primary' : 'hover:bg-primary/50'}`} end><FaHome size={20} /><span>Home</span></NavLink>
                <NavLink to="/user/dashboard" className={({isActive}) => `flex items-center gap-3 px-3 py-3 text-light rounded-md transition-colors ${isActive ? 'bg-primary' : 'hover:bg-primary/50'}`}><LayoutDashboard size={20} /><span>Dashboard</span></NavLink>
                <NavLink to="/cart" onClick={() => setIsMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-3 text-light rounded-md transition-colors ${isActive ? 'bg-primary' : 'hover:bg-primary/50'}`}>
                    <FaShoppingCart />
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                        <span className="ml-auto bg-primary text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                        {cartItemCount}
                        </span>
                    )}
                </NavLink>
                <button onClick={() => {handleLogout(); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 px-3 py-3 text-red-400 rounded-md hover:bg-red-600 hover:text-light transition-colors"><LogOut size={20} /><span>Logout</span></button>
              </>
            ) : (
              <>
                <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-3 text-light rounded-md transition-colors ${isActive ? 'bg-primary' : 'hover:bg-primary/50'}`} end><FaHome size={20} /><span>Home</span></NavLink>
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-3 text-light rounded-md transition-colors ${isActive ? 'bg-primary' : 'hover:bg-primary/50'}`}><LogIn size={20} /><span>Login</span></NavLink>
                <NavLink to="/signup" onClick={() => setIsMenuOpen(false)} className={({isActive}) => `flex items-center gap-3 px-3 py-3 text-light rounded-md transition-colors ${isActive ? 'bg-primary' : 'hover:bg-primary/50'}`}><UserPlus size={20} /><span>Sign Up</span></NavLink>
              </>
            )}
          </nav>
        </aside>
      </div>
    </header>
  );
}
