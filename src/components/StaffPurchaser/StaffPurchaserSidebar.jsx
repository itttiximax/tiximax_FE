import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaBoxOpen,
  FaUsers,
  FaWarehouse,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const StaffPurchaserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Thống kê",
      icon: <FaChartLine />,
      path: "/staff-purchaser/dashboard",
    },
    { text: "Đơn hàng", icon: <FaBoxOpen />, path: "/staff-purchaser/orders" },
    {
      text: "Nhà cung cấp",
      icon: <FaUsers />,
      path: "/staff-purchaser/suppliers",
    },
    {
      text: "Kho hàng",
      icon: <FaWarehouse />,
      path: "/staff-purchaser/inventory",
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
            Purchaser Staff
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ${
              isActive(item.path) ? "bg-blue-50 text-blue-700" : ""
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
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          <FaSignOutAlt className="text-xs" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default StaffPurchaserSidebar;
