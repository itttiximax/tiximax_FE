import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Wallet,
  UserStar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logout from "../../Page/Logout";
const StaffSaleSidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isShippingDropdownOpen, setIsShippingDropdownOpen] = useState(false);
  const [isQuotationDropdownOpen, setIsQuotationDropdownOpen] = useState(false);
  const [isPaymentSupportDropdownOpen, setIsPaymentSupportDropdownOpen] =
    useState(false);

  const isActive = (path) => location.pathname === path;

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
              label: "Mua hộ",
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
          icon: CreditCard,
          label: "Thanh toán",
          dropdownItems: [
            {
              to: "/staff-sale/createpaymentsupport",
              icon: Package,
              label: "Thanh toán đơn hàng",
            },
            {
              to: "/staff-sale/auction-payment",
              icon: Wallet,
              label: "Thanh toán đấu giá ",
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
        {
          type: "dropdown",
          icon: Banknote,
          label: "Theo dõi đơn hàng",
          dropdownItems: [
            {
              to: "/staff-sale/order-payment",
              icon: Banknote,
              label: "Quy trình đơn hàng",
            },
            {
              to: "/staff-sale/ship-payment",
              icon: Truck,
              label: "Xác nhận vận chuyển",
            },
          ],
          isOpen: isQuotationDropdownOpen,
          onToggle: () => setIsQuotationDropdownOpen(!isQuotationDropdownOpen),
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
            className={`flex items-center py-3 pl-4 pr-4 w-full text-left rounded-lg transition-colors duration-200 ${
              isDropdownActive
                ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Icon
              size={24}
              className={`flex-shrink-0 ${
                isDropdownActive ? "text-sky-600" : "text-gray-500"
              }`}
            />
            <span
              className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ml-3 ${
                isExpanded
                  ? "opacity-100 max-w-[200px]"
                  : "opacity-0 max-w-0 ml-0"
              }`}
            >
              {item.label}
            </span>
            <ChevronDown
              size={16}
              className={`flex-shrink-0 transition-all duration-300 ${
                item.isOpen ? "rotate-180" : ""
              } ${isDropdownActive ? "text-sky-600" : "text-gray-500"} ${
                isExpanded ? "opacity-100 ml-auto" : "opacity-0 ml-0"
              }`}
            />
          </button>
          {item.isOpen && isExpanded && (
            <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-3">
              {item.dropdownItems?.map((dropdownItem, dropdownIndex) => {
                const DropdownIcon = dropdownItem.icon;
                const dropdownActive = isActive(dropdownItem.to);

                return (
                  <Link
                    key={dropdownIndex}
                    to={dropdownItem.to}
                    className={`flex items-center py-2 pl-4 pr-4 rounded-lg transition-colors duration-200 ${
                      dropdownActive
                        ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                        : "text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <DropdownIcon
                      size={20}
                      className={`flex-shrink-0 ${
                        dropdownActive ? "text-sky-600" : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium ml-3">
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
        className={`flex items-center py-3 pl-4 pr-4 rounded-lg transition-colors duration-200 ${
          active
            ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
            : "text-slate-700 hover:bg-slate-200"
        }`}
      >
        <Icon
          size={24}
          className={`flex-shrink-0 ${
            active ? "text-sky-600" : "text-gray-500"
          }`}
        />
        <span
          className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ml-3 ${
            isExpanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 ml-0"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div
      className={`${
        isExpanded ? "w-72" : "w-20"
      } bg-slate-50 shadow-lg flex flex-col h-screen transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="p-1 border-b border-gray-200 flex flex-shrink-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-200 transition-colors"
        >
          {isExpanded ? (
            <>
              <span className="text-sm font-medium text-slate-700 mx-auto">
                Nhân viên sale
              </span>
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </>
          ) : (
            <ChevronRight className="w-6 h-6 text-slate-600 mx-auto" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <Link
          to="/staff-sale/profile"
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors duration-200 ${
            isActive("/staff-sale/profile")
              ? "bg-sky-100 text-sky-700 shadow-sm"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <User
            className={`w-10 h-10 ${
              isActive("/staff-sale/profile") ? "text-sky-600" : "text-gray-500"
            }`}
          />
          <span
            className={`text-base font-semibold text-slate-800 text-center whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "opacity-100 max-h-10 translate-y-0"
                : "opacity-0 max-h-0 -translate-y-2"
            }`}
          >
            Trần Tấn Phát
          </span>
        </Link>
      </div>

      {/* Navigation with hidden scrollbar */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto hide-scrollbar">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3
              className={`px-4 text-xs font-semibold uppercase text-slate-500 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isExpanded ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
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

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-slate-50 sticky bottom-0">
        <div className="relative w-full">
          <Logout
            className={`relative w-full flex items-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
            iconSize={20}
            buttonText="" // không hiển thị text mặc định
            redirectTo="/signin"
            showIcon={true}
            useConfirm={true}
            confirmMessage="Bạn có chắc chắn muốn đăng xuất?"
          />
          {isExpanded && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-white">
              Đăng xuất
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSaleSidebar;
