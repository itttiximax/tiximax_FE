import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaUserTie,
  FaMoneyCheck,
  FaPlaneDeparture,
  FaTruckMoving,
  FaGlobeAmericas,
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaBullhorn,
  FaUserCircle,
  FaChevronDown,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openCost, setOpenCost] = useState(false);
  // const [openSales, setOpenSales] = useState(true);

  // Cấu hình menu items theo cấu trúc hiện đại
  const menuSections = [
    {
      title: "Analytics",
      items: [
        {
          text: "Dashboard",
          icon: <FaChartLine />,
          path: "/manager/dashboard",
        },
        {
          text: "Teams",
          icon: <FaUserTie />,
          path: "/manager/team",
        },
        {
          text: "Customers",
          icon: <FaUsers />,
          path: "/manager/customers",
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          text: "Quotes",
          icon: <FaFileInvoiceDollar />,
          path: "/pages/quote",
        },
        {
          text: "Marketing",
          icon: <FaBullhorn />,
          path: "/pages/ads",
        },
      ],
    },
    {
      title: "Sales Management",
      items: [
        {
          text: "Payments",
          icon: <FaMoneyCheck />,
          hasSubmenu: true,
          isOpen: openCost,
          onToggle: () => setOpenCost(!openCost),
          submenuItems: [
            {
              text: "Pay Later",
              path: "/manager/cost/pay-later",
            },
            {
              text: "Pre-payment",
              path: "/manager/cost/pay-before",
            },
          ],
        },
        {
          text: "Routes",
          icon: <FaPlaneDeparture />,
          path: "/manager/routes",
        },
        {
          text: "Logistics",
          icon: <FaTruckMoving />,
          path: "/manager/transfer",
        },
        {
          text: "Product Types",
          icon: <FaGlobeAmericas />,
          path: "/manager/producttype",
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const renderMenuItem = (item) => {
    if (item.hasSubmenu) {
      return (
        <div key={item.text} className="relative">
          <button
            onClick={item.onToggle}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              item.isOpen
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
                : "hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  item.isOpen
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                }`}
              >
                {item.icon}
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
            <FaChevronDown
              className={`text-sm transition-all duration-300 ${
                item.isOpen ? "rotate-180 text-indigo-600" : "text-gray-400"
              }`}
            />
          </button>

          {/* Submenu with improved styling */}
          {item.isOpen && (
            <div className="ml-4 mt-2 space-y-1 animate-slideDown">
              {item.submenuItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`block px-6 py-2.5 ml-8 text-sm rounded-xl transition-all duration-200 relative ${
                    isActive(subItem.path)
                      ? "text-indigo-600 bg-indigo-50 font-medium shadow-sm border-l-2 border-indigo-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600 border-l-2 border-transparent hover:border-gray-200"
                  }`}
                >
                  {subItem.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
          isActive(item.path)
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 shadow-sm font-medium border border-indigo-100"
            : "hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm"
        }`}
      >
        <div
          className={`p-2 rounded-xl transition-all duration-300 ${
            isActive(item.path)
              ? "bg-indigo-100 text-indigo-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500"
          }`}
        >
          {item.icon}
        </div>
        <span className="font-medium">{item.text}</span>

        {/* Active indicator */}
        {isActive(item.path) && (
          <div className="absolute right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
        )}
      </Link>
    );
  };

  const renderMenuSection = (section) => (
    <div key={section.title} className="mb-8">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 relative">
        {section.title}
        <div className="absolute -bottom-2 left-4 w-8 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"></div>
      </h2>
      <div className="space-y-2">{section.items.map(renderMenuItem)}</div>
    </div>
  );

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 shadow-xl flex flex-col relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 pointer-events-none"></div>

      {/* Profile Section */}
      <div className="relative p-8 border-b border-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200/50">
              <FaUserCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-sm"></div>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">Manager</h3>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="relative flex-1 overflow-y-auto py-8 px-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {menuSections.map(renderMenuSection)}
      </div>

      {/* Logout Button */}
      <div className="relative p-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <FaSignOutAlt className="text-sm" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thumb-gray-200::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 9999px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default ManagerSidebar;
