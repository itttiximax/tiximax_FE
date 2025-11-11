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
  Package,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { ROLES } from "../Services/Auth/authService";

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cartCount] = useState(3);
  const [notificationCount] = useState(5);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const servicesRef = useRef(null);
  const guideRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  const searchSuggestions = useMemo(() => {
    if (!search) return [];
    return [
      { id: 1, text: "Dịch vụ vận chuyển hàng Nhật", type: "service" },
      { id: 2, text: "Tra cứu đơn hàng #DH12345", type: "order" },
      { id: 3, text: "Hướng dẫn đặt hàng", type: "guide" },
    ].filter((item) => item.text.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const notifications = [
    {
      id: 1,
      title: "Đơn hàng #DH001 đã được giao",
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      title: "Thanh toán thành công",
      time: "1 giờ trước",
      unread: true,
    },
    {
      id: 3,
      title: "Đơn hàng mới chờ xử lý",
      time: "2 giờ trước",
      unread: false,
    },
  ];

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
    if (PUBLIC_PATHS.includes(location.pathname)) {
      navigate(dashboardPath, { replace: true });
    }
  }, [isInternal, location.pathname, dashboardPath, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsProfileDropdownOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setIsNotificationOpen(false);
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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsProfileDropdownOpen(false);
        setIsNotificationOpen(false);
        setIsServicesOpen(false);
        setIsGuideOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
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
      toast.success("Đăng xuất thành công!");
      navigate("/", { replace: true });
    } catch {
      toast.error("Đăng xuất thất bại!");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const guardPublicClick = (to) => (e) => {
    if (isInternal) {
      e.preventDefault();
      toast("Bạn đang đăng nhập tài khoản nội bộ — chuyển về khu làm việc.", {
        icon: "🚧",
      });
      navigate(dashboardPath, { replace: true });
      closeAllMenus();
    } else {
      closeAllMenus();
      navigate(to);
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationOpen(false);
    setIsServicesOpen(false);
    setIsGuideOpen(false);
    setIsMobileSearchOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-amber-500 font-semibold"
      : "text-gray-700";

  const onSearchSubmit = () => {
    if (search.trim()) {
      toast.success(`Tìm kiếm: ${search}`);
      setSearch("");
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* SECTION 1: LOGO */}
          <div className="flex-shrink-0 mr-16">
            <Link
              to={isInternal ? dashboardPath : "/"}
              className="text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 transition-all"
            >
              TixiMax
            </Link>
          </div>

          {/* SECTION 2: NAVIGATION */}
          {!isInternal && (
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              <Link
                to="/"
                onClick={guardPublicClick("/")}
                className={`text-base font-medium hover:text-amber-500 transition-colors whitespace-nowrap ${isActive(
                  "/"
                )}`}
              >
                Trang chủ
              </Link>
              <Link
                to="/about"
                onClick={guardPublicClick("/about")}
                className={`text-base font-medium hover:text-amber-500 transition-colors whitespace-nowrap ${isActive(
                  "/about"
                )}`}
              >
                Về Tiximax
              </Link>

              {/* Services Dropdown */}
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setIsServicesOpen(!isServicesOpen)
                  }
                  className="text-base font-medium hover:text-amber-500 flex items-center gap-1 transition-colors whitespace-nowrap"
                  aria-expanded={isServicesOpen}
                  aria-haspopup="true"
                >
                  Dịch vụ
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/services/auction"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Dịch vụ đấu giá
                    </Link>
                    <Link
                      to="/services/storage"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Dịch vụ ký gửi kho
                    </Link>
                    <Link
                      to="/services/purchase"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Dịch vụ mua hộ
                    </Link>
                    <Link
                      to="/services/customs"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Dịch vụ thông quan hộ
                    </Link>
                    <Link
                      to="/services/shipping"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Dịch vụ vận chuyển
                    </Link>
                  </div>
                )}
              </div>

              {/* Guide Dropdown */}
              <div className="relative" ref={guideRef}>
                <button
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setIsGuideOpen(!isGuideOpen)
                  }
                  className="text-base font-medium hover:text-amber-500 flex items-center gap-1 transition-colors whitespace-nowrap"
                  aria-expanded={isGuideOpen}
                  aria-haspopup="true"
                >
                  Hướng dẫn
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isGuideOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isGuideOpen && (
                  <div className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/guide/order"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Hướng dẫn đặt hàng
                    </Link>
                    <Link
                      to="/guide/tracking"
                      className="block px-5 py-3 text-base text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      Hướng dẫn tra cứu đơn
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/news"
                onClick={guardPublicClick("/news")}
                className={`text-base font-medium hover:text-amber-500 transition-colors whitespace-nowrap ${isActive(
                  "/news"
                )}`}
              >
                Tin tức
              </Link>
              <Link
                to="/contact"
                onClick={guardPublicClick("/contact")}
                className={`text-base font-medium hover:text-amber-500 transition-colors whitespace-nowrap ${isActive(
                  "/contact"
                )}`}
              >
                Liên hệ
              </Link>
            </nav>
          )}

          {/* Spacer for internal users */}
          {isInternal && <div className="hidden lg:block flex-1"></div>}

          {/* SECTION 3: SEARCH */}
          <div className="hidden lg:flex items-center flex-shrink-0 min-w-[320px]">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                placeholder="Tìm kiếm..."
                className={`w-full pl-11 pr-4 py-3 text-base border rounded-xl focus:outline-none transition-all duration-200 ${
                  isSearchFocused
                    ? "border-amber-400 ring-2 ring-amber-100 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              {/* Search Suggestions */}
              {isSearchFocused && searchSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearch(item.text);
                        toast.success(`Tìm kiếm: ${item.text}`);
                      }}
                      className="w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-amber-50 flex items-center gap-3"
                    >
                      <Search size={16} className="text-gray-400" />
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: ACTIONS (Cart, Notifications, Profile) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="hidden md:block relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition"
                aria-label="Thông báo"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                    {notificationCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">
                      Thông báo
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-50 last:border-0 ${
                          notif.unread ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100">
                    <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart - Public only */}
            {!isInternal && (
              <Link
                to="/cart"
                className="hidden md:block relative p-2.5 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Auth */}
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition ml-2"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="lg:hidden pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 text-base border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200"
                autoFocus
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-200 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
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
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-amber-50 hover:text-amber-600 transition ${isActive(
                    "/"
                  )}`}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/about"
                  onClick={guardPublicClick("/about")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-amber-50 hover:text-amber-600 transition ${isActive(
                    "/about"
                  )}`}
                >
                  Về Tiximax
                </Link>

                {/* Services Mobile */}
                <div>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition"
                  >
                    Dịch vụ
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        isServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isServicesOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/services/auction"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Dịch vụ đấu giá
                      </Link>
                      <Link
                        to="/services/storage"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Dịch vụ ký gửi kho
                      </Link>
                      <Link
                        to="/services/purchase"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Dịch vụ mua hộ
                      </Link>
                      <Link
                        to="/services/customs"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Dịch vụ thông quan hộ
                      </Link>
                      <Link
                        to="/services/shipping"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Dịch vụ vận chuyển
                      </Link>
                    </div>
                  )}
                </div>

                {/* Guide Mobile */}
                <div>
                  <button
                    onClick={() => setIsGuideOpen(!isGuideOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition"
                  >
                    Hướng dẫn
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        isGuideOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isGuideOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/guide/order"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Hướng dẫn đặt hàng
                      </Link>
                      <Link
                        to="/guide/tracking"
                        className="block px-4 py-2 text-base text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                      >
                        Hướng dẫn tra cứu đơn
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/news"
                  onClick={guardPublicClick("/news")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-amber-50 hover:text-amber-600 transition ${isActive(
                    "/news"
                  )}`}
                >
                  Tin tức
                </Link>
                <Link
                  to="/contact"
                  onClick={guardPublicClick("/contact")}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-amber-50 hover:text-amber-600 transition ${isActive(
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
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition"
                >
                  <UserCircle size={20} className="mr-3" /> Hồ sơ cá nhân
                </Link>
                <Link
                  to="/order-history"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition"
                >
                  <Package size={20} className="mr-3" /> Đơn hàng của tôi
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition"
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
