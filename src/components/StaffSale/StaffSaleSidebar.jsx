import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  PackageSearch,
  Warehouse,
  Route,
  LogOut,
  ChevronDown,
  User,
  CreditCard,
  Phone,
  Book,
  List,
  History,
  TrendingUp,
  FileText,
  UserPlus,
  Landmark,
  Luggage,
  Banknote,
  CopyPlus,
  UserStar,
  Menu,
  X,
} from "lucide-react";

const StaffSaleSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isShippingDropdownOpen, setIsShippingDropdownOpen] = useState(false);
  const [isQuotationDropdownOpen, setIsQuotationDropdownOpen] = useState(false);
  const [isPaymentSupportDropdownOpen, setIsPaymentSupportDropdownOpen] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      section: "BÁN HÀNG",
      items: [
        {
          type: "dropdown",
          icon: FileText,
          label: "Tạo đơn",
          dropdownItems: [
            {
              to: "/staff-sale/create-invoice",
              icon: FileText,
              label: "Tạo hóa đơn",
            },
            {
              to: "/staff-sale/deposit",
              icon: Luggage,
              label: "Ký gửi",
            },
            {
              to: "/staff-sale/auction",
              icon: Landmark,
              label: "Đấu giá",
            },
          ],
          isOpen: isStaffDropdownOpen,
          onToggle: () => setIsStaffDropdownOpen(!isStaffDropdownOpen),
        },
        {
          type: "dropdown",
          icon: Banknote,
          label: "Báo giá",
          dropdownItems: [
            {
              to: "/staff-sale/order-payment",
              icon: Banknote,
              label: "Báo giá đơn hàng",
            },
            {
              to: "/staff-sale/ship-payment",
              icon: Truck,
              label: "Báo giá vận chuyển",
            },
          ],
          isOpen: isQuotationDropdownOpen,
          onToggle: () => setIsQuotationDropdownOpen(!isQuotationDropdownOpen),
        },
        {
          type: "dropdown",
          icon: CreditCard,
          label: "Hỗ trợ thanh toán",
          dropdownItems: [
            {
              to: "/staff-sale/createpaymentsupport",
              icon: Package,
              label: "Thanh toán đơn hàng",
            },
            {
              to: "/staff-sale/createpaymentshipping",
              icon: Truck,
              label: "Thanh toán vận chuyển",
            },
          ],
          isOpen: isPaymentSupportDropdownOpen,
          onToggle: () =>
            setIsPaymentSupportDropdownOpen(!isPaymentSupportDropdownOpen),
        },
      ],
    },
    {
      section: "QUẢN LÝ",
      items: [
        {
          type: "dropdown",
          icon: Users,
          label: "Quản lý khách hàng",
          dropdownItems: [
            {
              to: "/staff-sale/customers",
              icon: Users,
              label: "Danh sách khách hàng",
            },
            {
              to: "/staff-sale/createaccountuser",
              icon: UserPlus,
              label: "Tạo khách hàng",
            },
            {
              to: "/staff-sale/prospects",
              icon: UserStar,
              label: "Khách hàng tiềm năng",
            },
          ],
          isOpen: isCustomerDropdownOpen,
          onToggle: () => setIsCustomerDropdownOpen(!isCustomerDropdownOpen),
        },
        {
          type: "dropdown",
          icon: List,
          label: "Quản lý đơn hàng",
          dropdownItems: [
            {
              to: "/staff-sale/orders",
              icon: Package,
              label: "Tất cả đơn hàng",
            },
            {
              to: "/staff-sale/orders/pending",
              icon: PackageSearch,
              label: "Đang xử lý",
            },
          ],
          isOpen: isOrderDropdownOpen,
          onToggle: () => setIsOrderDropdownOpen(!isOrderDropdownOpen),
        },
        {
          type: "dropdown",
          icon: Truck,
          label: "Theo dõi vận chuyển",
          dropdownItems: [
            {
              to: "/staff-sale/shipping/domestic",
              icon: Truck,
              label: "Tra cứu đơn hàng",
            },
            {
              to: "/staff-sale/shipping/international",
              icon: History,
              label: "Lịch sử vận chuyển",
            },
            {
              to: "/staff-sale/tracking",
              icon: Route,
              label: "Lộ trình",
            },
          ],
          isOpen: isShippingDropdownOpen,
          onToggle: () => setIsShippingDropdownOpen(!isShippingDropdownOpen),
        },
        {
          to: "/staff-sale/warehouses",
          icon: Warehouse,
          label: "Kho hàng",
        },
        {
          to: "/staff-sale/telesale",
          icon: Phone,
          label: "Liên hệ",
        },
        {
          to: "/staff-sale/knowledge",
          icon: Book,
          label: "Tài liệu",
        },
      ],
    },
    {
      section: "BÁO CÁO",
      items: [
        {
          to: "/staff-sale/dashboard",
          icon: LayoutDashboard,
          label: "Thống kê",
        },
        {
          to: "/staff-sale/performance",
          icon: TrendingUp,
          label: "Hiệu suất cá nhân",
        },
      ],
    },
  ];

  const renderMenuItem = (item, itemIndex) => {
    const Icon = item.icon;

    if (item.type === "dropdown") {
      const isDropdownActive = item.dropdownItems?.some((dropdownItem) =>
        isActive(dropdownItem.to)
      );

      return (
        <div key={itemIndex} className="space-y-1">
          <button
            onClick={item.onToggle}
            className={`flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg transition-colors duration-200 ${
              isDropdownActive
                ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Icon
              size={20}
              className={isDropdownActive ? "text-sky-600" : "text-gray-500"}
            />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                item.isOpen ? "rotate-180" : ""
              } ${isDropdownActive ? "text-sky-600" : "text-gray-500"}`}
            />
          </button>
          {item.isOpen && (
            <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-3">
              {item.dropdownItems?.map((dropdownItem, dropdownIndex) => {
                const DropdownIcon = dropdownItem.icon;
                const dropdownActive = isActive(dropdownItem.to);

                return (
                  <Link
                    key={dropdownIndex}
                    to={dropdownItem.to}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      dropdownActive
                        ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                        : "text-slate-700 hover:bg-slate-200"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <DropdownIcon
                      size={18}
                      className={
                        dropdownActive ? "text-sky-600" : "text-gray-500"
                      }
                    />
                    <span className="text-sm font-medium">
                      {dropdownItem.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const active = isActive(item.to);

    return (
      <Link
        key={itemIndex}
        to={item.to}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
          active
            ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
            : "text-slate-700 hover:bg-slate-200"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon size={20} className={active ? "text-sky-600" : "text-gray-500"} />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-slate-700 p-2 rounded-lg bg-slate-50 shadow-md hover:bg-slate-100 transition-colors duration-200"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-50 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 h-screen`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <Link
            to="/staff-sale/profile"
            className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
              isActive("/staff-sale/profile")
                ? "bg-sky-100 text-sky-700 shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <User
              className={`w-8 h-8 ${
                isActive("/staff-sale/profile")
                  ? "text-sky-600"
                  : "text-gray-500"
              }`}
            />
            <span className="text-sm font-semibold text-slate-800">
              Nhân viên bán hàng
            </span>
          </Link>
        </div>

        {/* Navigation with hidden scrollbar */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto hide-scrollbar">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              <h3 className="px-4 text-xs font-semibold uppercase text-slate-500 tracking-wide">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) =>
                  renderMenuItem(item, itemIndex)
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Fixed Footer with Logout */}
        <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-slate-50 sticky bottom-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default StaffSaleSidebar;
