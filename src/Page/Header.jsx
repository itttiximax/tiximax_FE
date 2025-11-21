import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  UserCircle,
  History,
  ChevronDown,
  Menu,
  X,
  Package,
  Settings,
  Search,
} from "lucide-react";

// Mock hooks for demo - Toggle để test UI
const MockAuthProvider = () => {
  const [isAuth, setIsAuth] = React.useState(true);
  return {
    user: isAuth
      ? { username: "TIXIMAX", email: "user@tiximax.com", role: "CUSTOMER" }
      : null,
    isAuthenticated: isAuth,
    logout: async () => {
      await new Promise((r) => setTimeout(r, 500));
      setIsAuth(false);
    },
  };
};

const useAuth = MockAuthProvider;

const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  LEAD_SALE: "LEAD_SALE",
  STAFF_SALE: "STAFF_SALE",
  STAFF_PURCHASER: "STAFF_PURCHASER",
  STAFF_WAREHOUSE_FOREIGN: "STAFF_WAREHOUSE_FOREIGN",
  STAFF_WAREHOUSE_DOMESTIC: "STAFF_WAREHOUSE_DOMESTIC",
  CUSTOMER: "CUSTOMER",
};

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const servicesRef = useRef(null);
  const guideRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  const getDashboardPath = () => {
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
  };

  const dashboardPath = getDashboardPath();

  const isInternal =
    isAuthenticated && user?.role && user.role !== ROLES.CUSTOMER;

  // Redirect internal users khỏi public pages
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
    if (PUBLIC_PATHS.includes(location.pathname)) {
      navigate(dashboardPath, { replace: true });
    }
  }, [isInternal, location.pathname, dashboardPath, navigate]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsProfileDropdownOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
        setIsMobileMenuOpen(false);
      if (servicesRef.current && !servicesRef.current.contains(e.target))
        setIsServicesOpen(false);
      if (guideRef.current && !guideRef.current.contains(e.target))
        setIsGuideOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsProfileDropdownOpen(false);
        setIsServicesOpen(false);
        setIsGuideOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout();
      setIsProfileDropdownOpen(false);
      alert("Đăng xuất thành công!");
      navigate("/", { replace: true });
    } catch {
      alert("Đăng xuất thất bại!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsServicesOpen(false);
    setIsGuideOpen(false);
  };

  const guardPublicClick = (to) => (e) => {
    if (isInternal) {
      e.preventDefault();
      alert("Bạn đang đăng nhập tài khoản nội bộ — chuyển về khu làm việc.");
      navigate(dashboardPath, { replace: true });
      closeAllMenus();
    } else {
      closeAllMenus();
      navigate(to);
    }
  };

  const handleTrackingClick = () => {
    closeAllMenus();
    navigate("/tracking");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/")
      ? "text-orange-600 font-semibold"
      : "text-gray-700";

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: LOGO - dời sát lề trái */}
          <div className="flex-shrink-0">
            <Link
              to={isInternal ? dashboardPath : "/"}
              className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 transition-all"
            >
              TIXIMAX
            </Link>
          </div>

          {/* CENTER: NAV (desktop, chỉ hiện với khách) */}
          {!isInternal && (
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                onClick={guardPublicClick("/")}
                className={`text-lg font-medium hover:text-orange-600 transition-colors whitespace-nowrap ${isActive(
                  "/"
                )}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/about"
                onClick={guardPublicClick("/about")}
                className={`text-lg font-medium hover:text-orange-600 transition-colors whitespace-nowrap ${isActive(
                  "/about"
                )}`}
              >
                Về chúng tôi
              </Link>

              {/* Services - Split Link and Dropdown */}
              <div
                className="relative flex items-center gap-1"
                ref={servicesRef}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <Link
                  to="/services"
                  onClick={guardPublicClick("/services")}
                  className={`text-lg font-medium hover:text-orange-600 transition-colors whitespace-nowrap ${isActive(
                    "/services"
                  )}`}
                >
                  Dịch vụ
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsServicesOpen(!isServicesOpen);
                  }}
                  className="p-1 hover:bg-orange-50 rounded transition-colors"
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                  aria-label="Mở menu dịch vụ"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform text-gray-600 hover:text-orange-600 ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/services/auction"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Dịch vụ đấu giá
                      </Link>
                      <Link
                        to="/services/storage"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Dịch vụ ký gửi kho
                      </Link>
                      <Link
                        to="/services/purchase"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Dịch vụ mua hộ
                      </Link>
                      <Link
                        to="/services/customs"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Dịch vụ thông quan hộ
                      </Link>
                      <Link
                        to="/services/shipping"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Dịch vụ vận chuyển
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Guide - Split Link and Dropdown */}
              <div
                className="relative flex items-center gap-1"
                ref={guideRef}
                onMouseEnter={() => setIsGuideOpen(true)}
                onMouseLeave={() => setIsGuideOpen(false)}
              >
                <Link
                  to="/guide"
                  onClick={guardPublicClick("/guide")}
                  className={`text-lg font-medium hover:text-orange-600 transition-colors whitespace-nowrap ${isActive(
                    "/guide"
                  )}`}
                >
                  Hướng dẫn
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGuideOpen(!isGuideOpen);
                  }}
                  className="p-1 hover:bg-orange-50 rounded transition-colors"
                  aria-expanded={isGuideOpen}
                  aria-haspopup="true"
                  aria-label="Mở menu hướng dẫn"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform text-gray-600 hover:text-orange-600 ${
                      isGuideOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isGuideOpen && (
                  <div className="absolute left-0 top-full pt-2 w-64">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/guide/order"
                        onClick={() => setIsGuideOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Hướng dẫn đặt hàng
                      </Link>
                      <Link
                        to="/guide/tracking"
                        onClick={() => setIsGuideOpen(false)}
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Hướng dẫn tra cứu đơn
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/news"
                onClick={guardPublicClick("/news")}
                className={`text-lg font-medium hover:text-orange-600 transition-colors whitespace-nowrap ${isActive(
                  "/news"
                )}`}
              >
                Tin tức
              </Link>
              <Link
                to="/contact"
                onClick={guardPublicClick("/contact")}
                className={`text-lg font-medium hover:text-orange-600 transition-colors whitespace-nowrap ${isActive(
                  "/contact"
                )}`}
              >
                Liên hệ
              </Link>
            </nav>
          )}

          {/* RIGHT: ACTIONS - dời sát lề phải */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* User Profile / Auth desktop */}
            {isAuthenticated && user ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-3 text-gray-700 hover:text-amber-600 px-3 py-2 rounded-xl hover:bg-amber-50 transition"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-base font-semibold max-w-24 truncate">
                    {user.username || user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-base font-bold text-gray-900 truncate">
                        {user.username || user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                      >
                        <UserCircle size={18} className="mr-3" /> Hồ sơ cá nhân
                      </Link>
                      <Link
                        to="/order-history"
                        className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                      >
                        <History size={18} className="mr-3" /> Lịch sử đơn hàng
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                      >
                        <Settings size={18} className="mr-3" /> Cài đặt
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut size={18} className="mr-3" />
                        {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/signin"
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-base font-semibold hover:bg-gray-200 transition whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 shadow-md hover:shadow-lg transition whitespace-nowrap"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Tracking Button - CỐ ĐỊNH Ở VỊ TRÍ PHẢI NHẤT */}
            <button
              onClick={handleTrackingClick}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              <Search size={18} />
              <span>Theo dõi đơn</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Tracking Button - Mobile (Top priority) */}
            <button
              onClick={handleTrackingClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-md mb-4 transition-all"
            >
              <Search size={20} />
              <span>Theo dõi đơn hàng</span>
            </button>

            {/* User Info Mobile */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">
                    {user.username || user.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Navigation */}
            {!isInternal && (
              <nav className="space-y-1">
                <Link
                  to="/"
                  onClick={guardPublicClick("/")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-orange-50 hover:text-orange-600 transition ${isActive(
                    "/"
                  )}`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/about"
                  onClick={guardPublicClick("/about")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-orange-50 hover:text-orange-600 transition ${isActive(
                    "/about"
                  )}`}
                >
                  Về Tiximax
                </Link>

                {/* Services Mobile - Split */}
                <div>
                  <div className="flex items-center">
                    <Link
                      to="/services"
                      onClick={(e) => {
                        guardPublicClick("/services")(e);
                      }}
                      className={`flex-1 px-4 py-3 text-base font-medium rounded-xl hover:bg-orange-50 hover:text-orange-600 transition ${isActive(
                        "/services"
                      )}`}
                    >
                      Dịch vụ
                    </Link>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="p-3 hover:bg-orange-50 rounded-xl transition"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isServicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {isServicesOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/services/auction"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Dịch vụ đấu giá
                      </Link>
                      <Link
                        to="/services/storage"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Dịch vụ ký gửi kho
                      </Link>
                      <Link
                        to="/services/purchase"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Dịch vụ mua hộ
                      </Link>
                      <Link
                        to="/services/customs"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Dịch vụ thông quan hộ
                      </Link>
                      <Link
                        to="/services/shipping"
                        onClick={() => setIsServicesOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Dịch vụ vận chuyển
                      </Link>
                    </div>
                  )}
                </div>

                {/* Guide Mobile - Split */}
                <div>
                  <div className="flex items-center">
                    <Link
                      to="/guide"
                      onClick={(e) => {
                        guardPublicClick("/guide")(e);
                      }}
                      className={`flex-1 px-4 py-3 text-base font-medium rounded-xl hover:bg-orange-50 hover:text-orange-600 transition ${isActive(
                        "/guide"
                      )}`}
                    >
                      Hướng dẫn
                    </Link>
                    <button
                      onClick={() => setIsGuideOpen(!isGuideOpen)}
                      className="p-3 hover:bg-orange-50 rounded-xl transition"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isGuideOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {isGuideOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/guide/order"
                        onClick={() => setIsGuideOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Hướng dẫn đặt hàng
                      </Link>
                      <Link
                        to="/guide/tracking"
                        onClick={() => setIsGuideOpen(false)}
                        className="block px-4 py-2 text-base text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                      >
                        Hướng dẫn tra cứu đơn
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/news"
                  onClick={guardPublicClick("/news")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-orange-50 hover:text-orange-600 transition ${isActive(
                    "/news"
                  )}`}
                >
                  Tin tức
                </Link>
                <Link
                  to="/contact"
                  onClick={guardPublicClick("/contact")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-orange-50 hover:text-orange-600 transition ${isActive(
                    "/contact"
                  )}`}
                >
                  Liên hệ
                </Link>
              </nav>
            )}

            {/* Mobile User Actions */}
            {isAuthenticated && user ? (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                >
                  <UserCircle size={20} className="mr-3" /> Hồ sơ cá nhân
                </Link>
                <Link
                  to="/order-history"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                >
                  <Package size={20} className="mr-3" /> Đơn hàng của tôi
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                >
                  <Settings size={20} className="mr-3" /> Cài đặt
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                >
                  <LogOut size={20} className="mr-3" />
                  {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/signin"
                  className="block text-center bg-gray-100 text-gray-700 px-5 py-3 rounded-xl text-base font-bold hover:bg-gray-200 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="block text-center bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-white px-5 py-3 rounded-xl text-base font-bold hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 shadow-md transition"
                >
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
