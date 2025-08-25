import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  // Auto call parent search when user types
  useEffect(() => {
    const delay = setTimeout(() => {
      if (onSearch) onSearch(search);
    }, 300); // 300ms delay for better UX

    return () => clearTimeout(delay); // Clear previous timeout
  }, [search]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="w-full pl-6 pr-12 py-3 bg-white text-gray-900 placeholder-gray-400 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-base shadow-none"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
        <Search size={22} />
      </span>
    </div>
  );
}
