import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaBoxes,
  FaArrowDown,
  FaArrowUp,
  FaSignOutAlt,
  FaUserTie,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const StaffWarehouseForeignSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      text: "Thống kê",
      icon: <FaChartBar />,
      path: "/staff-warehouse-foreign/dashboard",
    },
    {
      text: "Tồn kho",
      icon: <FaBoxes />,
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-gray-700 p-2 rounded-lg bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white shadow-md flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 h-screen`}
      >
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col items-center gap-2">
            <FaUserTie className="w-8 h-8 text-blue-600" />
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-800">
                Foreign Warehouse Staff
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
                isActive(item.path) ? "bg-blue-50 text-blue-700 shadow-sm" : ""
              }`}
              onClick={() => setIsOpen(false)} // Close sidebar on link click in mobile
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

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default StaffWarehouseForeignSidebar;
