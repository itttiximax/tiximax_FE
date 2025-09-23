import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaBoxes,
  FaArrowDown,
  FaArrowUp,
  FaSignOutAlt,
  FaUserTie,
} from "react-icons/fa";

const StaffWarehouseDomesticSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Thống kê",
      icon: <FaChartBar />,
      path: "/staff-warehouse-domestic/dashboard",
    },
    {
      text: "Tồn kho",
      icon: <FaBoxes />,
      path: "/staff-warehouse-domestic/inventory",
    },
    {
      text: "Nhập hàng",
      icon: <FaArrowDown />,
      path: "/staff-warehouse-domestic/imports",
    },
    {
      text: "Xuất hàng",
      icon: <FaArrowUp />,
      path: "/staff-warehouse-domestic/exports",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col items-center gap-2">
          <FaUserTie className="w-8 h-8 text-blue-600" />
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-800">
              Domestic Warehouse Staff
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items with hidden scrollbar */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
              isActive(item.path) ? "bg-blue-50 text-blue-700 shadow-sm" : ""
            }`}
          >
            <span className="text-gray-500">{item.icon}</span>
            <span className="text-sm font-medium">{item.text}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaSignOutAlt className="text-xs" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default StaffWarehouseDomesticSidebar;
