import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaWarehouse,
  FaArrowDown,
  FaArrowUp,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const StaffWarehouseForeignSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Thống kê",
      icon: <FaChartLine />,
      path: "/staff-warehouse-foreign/dashboard",
    },
    {
      text: "Tồn kho",
      icon: <FaWarehouse />,
      path: "/staff-warehouse-foreign/inventory",
    },
    {
      text: "Nhập hàng",
      icon: <FaArrowDown />,
      path: "/staff-warehouse-foreign/import",
    },
    {
      text: "Xuất hàng",
      icon: <FaArrowUp />,
      path: "/staff-warehouse-foreign/export",
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
        <div className="flex items-center gap-3">
          <FaUserCircle className="w-8 h-8 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">
            Foreign Warehouse Staff
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150 ease-in-out transform hover:scale-[1.02] ${
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
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-150 ease-in-out transform hover:scale-[1.02]"
        >
          <FaSignOutAlt className="text-xs" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>

      {/* Custom Styles for Animations */}
      <style>{`
        .transform {
          transition: transform 0.15s ease-in-out;
        }
        .hover\\:scale-\\[1\\.02\\]:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default StaffWarehouseForeignSidebar;
