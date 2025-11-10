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
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

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

  useEffect(() => {
    if (!isInternal) return;
    const PUBLIC_PATHS = [
      "/",
      "/home",
      "/about",
      "/services",
      "/blog",
      "/contact",
      "/signin",
      "/signup",
    ];
    if (PUBLIC_PATHS.includes(location.pathname))
      navigate(dashboardPath, { replace: true });
  }, [isInternal, location.pathname, dashboardPath, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsProfileDropdownOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
        setIsMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleProfileDropdown = () => setIsProfileDropdownOpen((s) => !s);
  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);

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

  const isActive = (path) =>
    location.pathname === path ? "text-yellow-700" : "text-gray-700";

  const onSearchSubmit = (e) => {
    e.preventDefault();
    toast.success(`Tìm kiếm: ${search || "(trống)"}`);
  };

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isInternal ? dashboardPath : "/"}
            onClick={(e) => {
              e.preventDefault();
              navigate(isInternal ? dashboardPath : "/", { replace: true });
            }}
            className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent"
          >
            TixiMax
          </Link>

          {/* --- MAIN MENU (public only) --- */}
          {!isInternal && (
            <nav className="hidden lg:flex gap-6 text-sm font-medium">
              <Link
                to="/"
                onClick={guardPublicClick("/")}
                className={`hover:text-yellow-600 ${isActive("/")}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/about"
                onClick={guardPublicClick("/about")}
                className={`hover:text-yellow-600 ${isActive("/about")}`}
              >
                Về Tiximax
              </Link>

              {/* Dropdown: DỊCH VỤ */}
              <div className="relative group">
                <button className="hover:text-yellow-600 flex items-center gap-1">
                  Dịch vụ
                  <ChevronDown size={14} />
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-lg w-56 mt-2">
                  <ul className="text-sm text-gray-700 py-2">
                    <li>
                      <Link
                        to="/services/auction"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Dịch vụ đấu giá
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/storage"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Dịch vụ ký gửi kho
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/purchase"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Dịch vụ mua hộ
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/customs"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Dịch vụ thông quan hộ
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/shipping"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Dịch vụ vận chuyển
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Dropdown: HƯỚNG DẪN */}
              <div className="relative group">
                <button className="hover:text-yellow-600 flex items-center gap-1">
                  Hướng dẫn
                  <ChevronDown size={14} />
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-lg w-56 mt-2">
                  <ul className="text-sm text-gray-700 py-2">
                    <li>
                      <Link
                        to="/guide/order"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Hướng dẫn đặt hàng
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/guide/tracking"
                        className="block px-4 py-2 hover:bg-yellow-50"
                      >
                        Hướng dẫn tra cứu đơn
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                to="/news"
                onClick={guardPublicClick("/news")}
                className={`hover:text-yellow-600 ${isActive("/news")}`}
              >
                Tin tức
              </Link>
              <Link
                to="/contact"
                onClick={guardPublicClick("/contact")}
                className={`hover:text-yellow-600 ${isActive("/contact")}`}
              >
                Liên hệ
              </Link>
            </nav>
          )}

          {/* Search & Action */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={onSearchSubmit} className="relative w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none transition-all duration-200 ${
                  isSearchFocused
                    ? "border-yellow-400 ring-2 ring-yellow-100"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </form>

            <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition">
              <Bell size={18} />
            </button>

            {!isInternal && (
              <button className="relative p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition">
                <ShoppingCart size={18} />
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  3
                </span>
              </button>
            )}

            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-yellow-700 px-2 py-1 rounded-lg hover:bg-yellow-50"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium max-w-20 truncate">
                    {user.username || user.name}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
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
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                      >
                        <UserCircle size={14} className="mr-2" /> Hồ sơ cá nhân
                      </Link>
                      <Link
                        to="/order-history"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                      >
                        <History size={14} className="mr-2" /> Lịch sử đơn hàng
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} className="mr-2" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/signin"
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:from-yellow-500 hover:to-yellow-600"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-yellow-600"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
