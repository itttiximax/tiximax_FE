// src/components/Header.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  LogOut,
  UserCircle,
  History,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { ROLES } from "../Services/Auth/authService";

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  // === helper: dashboard theo role ===
  const dashboardPath = useMemo(() => {
    const role = user?.role;
    switch (role) {
      case ROLES.ADMIN:
        return "/admin/dashboard";
      case ROLES.MANAGER:
        return "/manager/dashboard";
      case ROLES.LEAD_SALE:
        return "/lead-sale/dashboard";
      case ROLES.STAFF_SALE:
        return "/staff-sale";
      case ROLES.STAFF_PURCHASER:
        return "/staff-purchaser/dashboard";
      case ROLES.STAFF_WAREHOUSE_FOREIGN:
        return "/staff-warehouse-foreign/dashboard";
      case ROLES.STAFF_WAREHOUSE_DOMESTIC:
        return "/staff-warehouse-domestic/dashboard";
      default:
        return "/";
    }
  }, [user?.role]);

  const isInternal =
    isAuthenticated && user?.role && user.role !== ROLES.CUSTOMER;

  // Tự động chuyển hướng nếu user nội bộ đang ở trang public
  useEffect(() => {
    if (!isInternal) return;

    // Các path public (bạn có thể mở rộng thêm)
    const PUBLIC_PATHS = [
      "/",
      "/home",
      "/about",
      "/services",
      "/blog",
      "/contact",
      "/signin",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/auth/callback",
    ];

    if (PUBLIC_PATHS.includes(location.pathname)) {
      navigate(dashboardPath, { replace: true });
    }
  }, [isInternal, location.pathname, dashboardPath, navigate]);

  // Đóng dropdown/menu khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await authLogout();
      setIsProfileDropdownOpen(false);
      toast.success("Đăng xuất thành công!");
      navigate("/", { replace: true });
    } catch {
      toast.error("Đăng xuất thất bại!");
    }
  };

  // Toggle
  const toggleProfileDropdown = () => setIsProfileDropdownOpen((s) => !s);
  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);

  // Chặn vào khu customer/public nếu là nội bộ
  const guardPublicClick = (to) => (e) => {
    if (isInternal) {
      e.preventDefault();
      toast("Bạn đang đăng nhập tài khoản nội bộ — chuyển về khu làm việc.", {
        icon: "🚧",
      });
      navigate(dashboardPath, { replace: true });
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
    } else {
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
      navigate(to);
    }
  };

  const publicMenus = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/services", label: "Dịch vụ" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Liên hệ" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            {/* Logo: nội bộ -> về dashboard; khách -> về "/" */}
            <a
              href={isInternal ? dashboardPath : "/"}
              onClick={(e) => {
                e.preventDefault();
                navigate(isInternal ? dashboardPath : "/", { replace: true });
              }}
              className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"
            >
              TixiMax
            </a>
          </div>

          {/* Center Section - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {!isInternal &&
              publicMenus.map((m) => (
                <a
                  key={m.to}
                  href={m.to}
                  onClick={guardPublicClick(m.to)}
                  className="text-sm text-gray-700 hover:text-yellow-600 transition duration-200 py-2"
                >
                  {m.label}
                </a>
              ))}
          </nav>

          {/* Right Section - Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none transition-all duration-200 ${
                    isSearchFocused
                      ? "border-yellow-400 ring-2 ring-yellow-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  disabled={false}
                />
                <Search
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition duration-200">
                <Bell size={18} />
              </button>

              {/* Shopping Cart: chỉ hiện cho khách/CUSTOMER */}
              {!isInternal && (
                <button className="relative p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition duration-200">
                  <ShoppingCart size={18} />
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
              )}

              {/* User Section */}
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 transition duration-200 px-2 py-1 rounded-lg hover:bg-yellow-50"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block max-w-20 truncate">
                      {user.username || user.name}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 hidden sm:block ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.username || user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email || "user@example.com"}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition duration-150"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <UserCircle size={14} className="mr-2" />
                          Profile
                        </Link>

                        {/* Link customer-only: ẩn khi nội bộ */}
                        {!isInternal && (
                          <>
                            <Link
                              to="/order-history"
                              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition duration-150"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <History size={14} className="mr-2" />
                              Lịch sử
                            </Link>
                            <Link
                              to="/order-history"
                              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition duration-150"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <History size={14} className="mr-2" />
                              Theo dõi đơn hàng
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150"
                        >
                          <LogOut size={14} className="mr-2" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/signin"
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition duration-200"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition duration-200"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40"
        >
          {/* Mobile Search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                disabled={false}
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {!isInternal && (
            <nav className="px-4 py-2">
              {publicMenus.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={guardPublicClick(item.to)}
                  className="block py-2 text-gray-700 hover:text-yellow-600 transition duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          {/* Mobile Auth Buttons */}
          {!isAuthenticated && (
            <div className="px-4 py-3 border-t border-gray-100 space-y-2">
              <Link
                to="/signin"
                className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-2 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600 transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
