import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  // ==============================
  // Cấu hình menu items theo cấu trúc hiện đại
  // ==============================
  const menuSections = [
    {
      title: "Analytics",
      items: [
        {
          text: "Dashboard",
          icon: <FaChartLine />,
          path: "/admin/dashboard",
        },
        {
          text: "Orders",
          icon: <FaClipboardList />,
          path: "/admin/orders",
        },
        {
          text: "Staff",
          icon: <FaUserTie />,
          path: "/admin/staff",
        },
        {
          text: "Customers",
          icon: <FaUsers />,
          path: "/admin/customers",
        },
        {
          text: "Customers",
          icon: <FaUsers />,
          path: "/admin/createaccount",
        },
      ],
    },
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl fixed lg:sticky top-0">
      {/* Logo */}
      <div className="p-6 text-2xl font-extrabold text-center border-b border-gray-700/30">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
          Admin Panel
        </span>
      </div>

      {/* Menu Sections */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-indigo-600 text-white shadow-md"
                      : "hover:bg-gray-700/70 hover:text-indigo-300"
                  } font-medium text-sm tracking-wide`}
                >
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                  {item.text}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg bg-red-600/90 hover:bg-red-700 transition-all duration-300 font-medium text-sm tracking-wide shadow-md"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
