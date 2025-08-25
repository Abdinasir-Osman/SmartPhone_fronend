import { FaArrowUp } from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0C2338] text-gray-400 dark:text-gray-300 py-8 px-4 mt-12 border-t border-gray-700 font-segoe">
      <div className="max-w-7xl mx-auto text-center text-sm">
        {/* ✅ Brand */}
        <div className="mb-4">
          <span className="text-2xl font-extrabold text-[#EC6325]">
            Xaliye <span className="text-white">Phones</span>
          </span>{" "}
          © {new Date().getFullYear()} - All rights reserved.
        </div>

        {/* ✅ Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-4">
          <a
            href="/privacy"
            className="transition duration-300 hover:text-[#EC6325] hover:underline underline-offset-4"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="transition duration-300 hover:text-[#EC6325] hover:underline underline-offset-4"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="transition duration-300 hover:text-[#EC6325] hover:underline underline-offset-4"
          >
            Contact
          </a>
        </div>

        {/* ✅ Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute right-6 bottom-6 sm:right-10 sm:bottom-10 bg-[#EC6325] text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-[#e45b1f] transition transform duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
}
