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
} from "lucide-react";

const StaffPurchaserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          label: "Đơn hàng",
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
          <h2 className="text-lg font-semibold text-gray-800">
            Purchaser Staff
          </h2>
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

export default StaffPurchaserSidebar;
