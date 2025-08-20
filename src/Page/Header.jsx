import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ShoppingCart } from "lucide-react";

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/home"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent"
        >
          TixiMax
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-8 text-gray-700 text-base font-semibold">
          <Link
            to="/home"
            className="hover:text-blue-600 transition duration-200"
          >
            Trang chủ
          </Link>
          <Link
            to="/mua-hang"
            className="hover:text-blue-600 transition duration-200"
          >
            Mua hàng
          </Link>
          <Link
            to="/ship-hang"
            className="hover:text-blue-600 transition duration-200"
          >
            Ship hàng
          </Link>
          <Link
            to="/blog"
            className="hover:text-blue-600 transition duration-200"
          >
            Blog
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 mx-8 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={`w-full px-4 py-2 text-base border rounded-full focus:outline-none transition-all duration-200 ${
                isSearchFocused
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-300"
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search
              className="absolute right-4 top-3 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Icons and Buttons */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600 transition duration-200">
            <Bell size={24} />
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition duration-200">
            <ShoppingCart size={24} />
          </button>
          <Link
            to="/dang-ky"
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-base font-medium hover:bg-blue-700 transition duration-200"
          >
            Đăng ký
          </Link>
          <Link
            to="/signin"
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full text-base font-medium hover:bg-gray-300 transition duration-200"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
