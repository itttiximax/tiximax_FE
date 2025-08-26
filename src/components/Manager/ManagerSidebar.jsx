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
} from "react-icons/fa";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openCost, setOpenCost] = useState(false);

  // Cấu hình menu items theo cấu trúc dễ đọc
  const menuSections = [
    {
      title: "Báo cáo",
      items: [
        {
          text: "Doanh thu",
          icon: <FaChartLine />,
          path: "/manager/dashboard",
        },
        {
          text: "Nhóm bán hàng",
          icon: <FaUserTie />,
          path: "/manager/team",
        },
        {
          text: "Khách hàng",
          icon: <FaUsers />,
          path: "/manager/customers",
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          text: "Báo giá",
          icon: <FaFileInvoiceDollar />,
          path: "/pages/quote",
        },
        {
          text: "Quảng cáo",
          icon: <FaBullhorn />,
          path: "/pages/ads",
        },
      ],
    },
    {
      title: "Sales Management",
      items: [
        {
          text: "Chi phí",
          icon: <FaMoneyCheck />,
          hasSubmenu: true,
          isOpen: openCost,
          onToggle: () => setOpenCost(!openCost),
          submenuItems: [
            {
              text: "Thanh toán sau",
              path: "/manager/cost/pay-later",
            },
            {
              text: "Thanh toán trước",
              path: "/manager/cost/pay-before",
            },
          ],
        },
        {
          text: "Chuyến bay",
          icon: <FaPlaneDeparture />,
          path: "/manager/routes",
        },
        {
          text: "Vận chuyển",
          icon: <FaTruckMoving />,
          path: "/manager/transfer",
        },
        {
          text: "Quốc gia",
          icon: <FaGlobeAmericas />,
          path: "/manager/countries",
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
        <div key={item.text}>
          <button
            onClick={item.onToggle}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
              item.isOpen
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "hover:bg-gray-50 text-gray-700 hover:text-indigo-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-lg ${
                  item.isOpen ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
            <FaChevronDown
              className={`text-sm transition-transform duration-200 ${
                item.isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Submenu */}
          {item.isOpen && (
            <div className="ml-8 mt-2 space-y-1 animate-slideDown">
              {item.submenuItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isActive(subItem.path)
                      ? "text-indigo-600 bg-indigo-50 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive(item.path)
            ? "bg-indigo-50 text-indigo-700 shadow-sm font-medium"
            : "hover:bg-gray-50 text-gray-700 hover:text-indigo-600"
        }`}
      >
        <span
          className={`text-lg ${
            isActive(item.path) ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          {item.icon}
        </span>
        <span className="text-sm font-medium">{item.text}</span>
      </Link>
    );
  };

  const renderMenuSection = (section) => (
    <div key={section.title} className="mb-8">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
        {section.title}
      </h2>
      <div className="space-y-1">{section.items.map(renderMenuItem)}</div>
    </div>
  );

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <FaUserCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-gray-800">Manager</h3>
          <span className="text-sm text-gray-500">Quản lý hệ thống</span>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto py-6">
        {menuSections.map(renderMenuSection)}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <FaSignOutAlt className="text-sm" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ManagerSidebar;
