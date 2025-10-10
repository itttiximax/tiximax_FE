import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Warehouse,
  LogOut,
  User,
  ChevronDown,
  Landmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StaffPurchaserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: "NHÂN VIÊN MUA HÀNG",
      items: [
        {
          to: "/staff-purchaser/dashboard",
          icon: LayoutDashboard,
          label: "Tổng quan",
        },
        {
          to: "/staff-purchaser/orders",
          icon: Package,
          label: "Đơn hàng mua hộ",
        },
        {
          to: "/staff-purchaser/auction",
          icon: Landmark,
          label: "Đơn hàng đấu giá",
        },
        {
          to: "/staff-purchaser/suppliers",
          icon: Users,
          label: "Nhà cung cấp",
        },
        {
          type: "dropdown",
          icon: Warehouse,
          label: "Quản lý kho hàng",
          dropdownItems: [
            {
              to: "/staff-purchaser/inventory",
              icon: Warehouse,
              label: "Tồn kho",
            },
            {
              to: "/staff-purchaser/inventory/audit",
              icon: Package,
              label: "Kiểm kho",
            },
          ],
          isOpen: isInventoryDropdownOpen,
          onToggle: () => setIsInventoryDropdownOpen(!isInventoryDropdownOpen),
        },
      ],
    },
  ];

  const renderMenuItem = (item, index) => {
    const Icon = item.icon;

    if (item.type === "dropdown") {
      const isDropdownActive = item.dropdownItems?.some((d) => isActive(d.to));

      return (
        <div key={index} className="space-y-1">
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
              {item.dropdownItems?.map((dropdownItem, i) => {
                const DropdownIcon = dropdownItem.icon;
                const dropdownActive = isActive(dropdownItem.to);
                return (
                  <Link
                    key={i}
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
        key={index}
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
      <div className="p-2 border-b border-gray-200 flex justify-end flex-shrink-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          title={isExpanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          ) : (
            <ChevronRight className="w-6 h-6 text-slate-600" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <Link
          to="/staff-purchaser/profile"
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors duration-200 ${
            isActive("/staff-purchaser/profile")
              ? "bg-sky-100 text-sky-700 shadow-sm"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <User
            className={`w-10 h-10 ${
              isActive("/staff-purchaser/profile")
                ? "text-sky-600"
                : "text-gray-500"
            }`}
          />
          <span
            className={`text-base font-semibold text-slate-800 text-center whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "opacity-100 max-h-10 translate-y-0"
                : "opacity-0 max-h-0 -translate-y-2"
            }`}
          >
            Nhân viên mua hàng
          </span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-3 overflow-y-auto hide-scrollbar">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3
              className={`px-4 text-xs font-semibold uppercase text-slate-500 tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isExpanded ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              {section.section}
            </h3>
            <div className="space-y-1">{section.items.map(renderMenuItem)}</div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-slate-50 sticky bottom-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center py-3 pl-4 pr-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span
            className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ml-2 ${
              isExpanded
                ? "opacity-100 max-w-[200px]"
                : "opacity-0 max-w-0 ml-0"
            }`}
          >
            Đăng xuất
          </span>
        </button>
      </div>
    </div>
  );
};

export default StaffPurchaserSidebar;
