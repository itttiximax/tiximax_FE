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
  Menu,
  X,
  Landmark,
} from "lucide-react";

const StaffPurchaserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

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
            className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors duration-200 ${
              isDropdownActive
                ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isDropdownActive ? "text-sky-600" : "text-gray-500"
              }`}
            />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
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
                      className={`w-5 h-5 ${
                        dropdownActive ? "text-sky-600" : "text-gray-500"
                      }`}
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
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
          active
            ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
            : "text-slate-700 hover:bg-slate-200"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <Icon
          className={`w-5 h-5 ${active ? "text-sky-600" : "text-gray-500"}`}
        />
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
            to="/staff-purchaser/profile"
            className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
              isActive("/staff-purchaser/profile")
                ? "bg-sky-100 text-sky-700 shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <User
              className={`w-10 h-10 ${
                isActive("/staff-purchaser/profile")
                  ? "text-sky-600"
                  : "text-gray-500"
              }`}
            />
            <span className="text-sm font-semibold text-slate-800">
              Nhân viên mua hàng
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
            <LogOut className="w-4 h-4" />
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

export default StaffPurchaserSidebar;
