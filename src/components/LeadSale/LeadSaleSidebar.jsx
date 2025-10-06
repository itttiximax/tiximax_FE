import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Users2,
  MapPin,
  Truck,
  LogOut,
  ChevronDown,
  User,
  Package,
  Calendar,
  History,
  Route,
  FileText,
  Megaphone,
  List,
  TrendingUp,
  Luggage,
  Landmark,
  Banknote,
  UserPlus,
  UserStar,
  PackageSearch,
  CreditCard,
} from "lucide-react";

const LeadSaleSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isStaffLeadDropdownOpen, setIsStaffLeadDropdownOpen] = useState(false);
  const [isShippingDropdownOpen, setIsShippingDropdownOpen] = useState(false);
  const [isQuotationDropdownOpen, setIsQuotationDropdownOpen] = useState(false); // Báo giá
  const [isPaymentSupportDropdownOpen, setIsPaymentSupportDropdownOpen] =
    useState(false); // Hỗ trợ thanh toán

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: "BÁN HÀNG",
      items: [
        {
          type: "dropdown",
          to: "/lead-sale/createorder",
          icon: FileText,
          label: "Tạo đơn",
          dropdownItems: [
            {
              to: "/lead-sale/createorder",
              icon: FileText,
              label: "Tạo hóa đơn",
            },
            {
              to: "/lead-sale/deposit",
              icon: Luggage,
              label: "Ký gửi",
            },
            {
              to: "/lead-sale/auction",
              icon: Landmark,
              label: "Đấu giá",
            },
          ],
          isOpen: isStaffLeadDropdownOpen,
          onToggle: () => setIsStaffLeadDropdownOpen(!isStaffLeadDropdownOpen),
        },
        {
          type: "dropdown",
          icon: Banknote,
          label: "Báo giá",
          dropdownItems: [
            {
              to: "/lead-sale/order-payment",
              icon: Banknote,
              label: "Báo giá đơn hàng",
            },
            {
              to: "/lead-sale/ship-payment",
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
              to: "/lead-sale/createpaymentsupport",
              icon: Package,
              label: "Thanh toán đơn hàng",
            },
            {
              to: "/lead-sale/createpaymentshipping",
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
      section: "LEADER SALE",
      items: [
        {
          to: "/lead-sale/dashboard",
          icon: LayoutDashboard,
          label: "Tổng quan",
        },
        {
          to: "/lead-sale/team",
          icon: Users,
          label: "Quản lý đội nhóm",
        },
        {
          to: "/lead-sale/salesreport",
          icon: BarChart3,
          label: "Thống kê bán hàng",
        },
        {
          to: "/lead-sale/team-performance",
          icon: TrendingUp,
          label: "Hiệu suất đội nhóm",
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
              to: "/lead-sale/customers",
              icon: Users,
              label: "Danh sách khách hàng",
            },
            {
              to: "/lead-sale/createaccountuser",
              icon: UserPlus,
              label: "Tạo khách hàng",
            },
            {
              to: "/lead-sale/prospects",
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
              to: "/lead-sale/orders",
              icon: Package,
              label: "Tất cả đơn hàng",
            },
            {
              to: "/lead-sale/orders/tracking",
              icon: PackageSearch,
              label: "Đơn hàng đang xử lý",
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
              to: "/lead-sale/shipping/domestic",
              icon: Truck,
              label: "Tra cứu đơn hàng",
            },
            {
              to: "/lead-sale/shipping/international",
              icon: History,
              label: "Lịch sử vận chuyển",
            },
            {
              to: "/lead-sale/tracking",
              icon: Route,
              label: "Lộ trình",
            },
          ],
          isOpen: isShippingDropdownOpen,
          onToggle: () => setIsShippingDropdownOpen(!isShippingDropdownOpen),
        },
        {
          type: "dropdown",
          icon: Users2,
          label: "Quản lý nhân viên",
          dropdownItems: [
            {
              to: "/lead-sale/warehouse-staff",
              icon: Package,
              label: "Nhân viên kho",
            },
            {
              to: "/lead-sale/sales-staff",
              icon: Users,
              label: "Nhân viên sale",
            },
          ],
          isOpen: isStaffDropdownOpen,
          onToggle: () => setIsStaffDropdownOpen(!isStaffDropdownOpen),
        },
        {
          to: "/lead-sale/destination",
          icon: MapPin,
          label: "Quản lý lộ trình",
        },
        {
          to: "/lead-sale/schedule",
          icon: Calendar,
          label: "Quản lý lịch hẹn",
        },
        {
          to: "/lead-sale/campaigns",
          icon: Megaphone,
          label: "Chiến dịch bán hàng",
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
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon
              size={20}
              className={isDropdownActive ? "text-indigo-700" : "text-gray-500"}
            />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                item.isOpen ? "rotate-180" : ""
              } ${isDropdownActive ? "text-indigo-700" : "text-gray-500"}`}
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
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <DropdownIcon
                      size={18}
                      className={
                        dropdownActive ? "text-indigo-700" : "text-gray-500"
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
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon
          size={20}
          className={active ? "text-indigo-700" : "text-gray-500"}
        />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-white flex flex-col border-r border-gray-200 shadow-sm fixed">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Leader Sale</h2>
        </div>
      </div>

      {/* Navigation with hidden scrollbar */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto hide-scrollbar">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 tracking-wide">
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
      <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-white sticky bottom-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
