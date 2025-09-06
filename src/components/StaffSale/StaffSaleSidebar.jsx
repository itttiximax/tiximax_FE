import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaShippingFast,
  FaTruck,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaPhoneAlt,
  FaUserCircle,
  FaChevronDown,
  FaCalculator,
  FaWarehouse,
  FaRoute,
} from "react-icons/fa";

const StaffSaleSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openOrders, setOpenOrders] = useState(false);
  const [openLogistics, setOpenLogistics] = useState(false);

  const menuSections = [
    {
      title: "Bán hàng",
      items: [
        {
          text: "Tạo hóa đơn",
          icon: <FaBoxOpen />,
          path: "/staff-sale/create-invoice",
        },
      ],
    },
    {
      title: "Báo cáo",
      items: [
        {
          text: "Thống kê bán hàng",
          icon: <FaChartLine />,
          path: "/staff-sale/dashboard",
        },
      ],
    },
    {
      title: "Quản lí khách hàng",
      items: [
        {
          text: "Danh sách khách hàng",
          icon: <FaUsers />,
          path: "/staff-sale/customers",
        },
        {
          text: "Hỗ trợ khách hàng",
          icon: <FaPhoneAlt />,
          path: "/staff-sale/support",
        },
      ],
    },
    {
      title: "Quản lí đơn hàng",
      items: [
        {
          text: "Bán hàng",
          icon: <FaBoxOpen />,
          hasSubmenu: true,
          isOpen: openOrders,
          onToggle: () => setOpenOrders(!openOrders),
          submenuItems: [
            { text: "All Orders", path: "/staff-sale/orders" },
            { text: "Pending Orders", path: "/staff-sale/orders/pending" },
          ],
        },
        {
          text: "Báo giá",
          icon: <FaCalculator />,
          path: "/staff-sale/quotations",
        },
      ],
    },
    {
      title: "Quản lí vận chuyển",
      items: [
        {
          text: "Theo dõi đơn hàng",
          icon: <FaShippingFast />,
          hasSubmenu: true,
          isOpen: openLogistics,
          onToggle: () => setOpenLogistics(!openLogistics),
          submenuItems: [
            { text: "Khách lẻ", path: "/staff-sale/shipping/domestic" },
            {
              text: "Khách đại lí",
              path: "/staff-sale/shipping/international",
            },
          ],
        },
        {
          text: "Theo dõi lộ trình",
          icon: <FaRoute />,
          path: "/staff-sale/tracking",
        },

        {
          text: "Xem kho",
          icon: <FaWarehouse />,
          path: "/staff-sale/warehouses",
        },
        {
          text: "Tạo tài khoản khách hàng",
          icon: <FaWarehouse />,
          path: "/staff-sale/createaccountuser",
        },
        // {
        //   text: " Đội xe",
        //   icon: <FaTruck />,
        //   path: "/staff-sale/fleet",
        // },
        // {
        //   text: "Xem dịch vụ ",
        //   icon: <FaMapMarkedAlt />,
        //   path: "/staff-sale/service",
        // },
        // {
        //   text: " Đội xe",
        //   icon: <FaTruck />,
        //   path: "/staff-sale/fleet",
        // },
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
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ease-in-out group ${
              item.isOpen ? "bg-blue-50 text-blue-700" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`text-lg transition-colors duration-200 ${
                  item.isOpen
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
            <FaChevronDown
              className={`text-xs transition-all duration-300 ease-in-out ${
                item.isOpen
                  ? "rotate-180 text-blue-600"
                  : "text-gray-400 group-hover:text-blue-600"
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              item.isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-6 mt-2 space-y-1 pb-2">
              {item.submenuItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`block px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ease-in-out transform hover:translate-x-1 ${
                    isActive(subItem.path)
                      ? "bg-blue-100 text-blue-700 font-medium border-l-3 border-blue-500"
                      : ""
                  }`}
                >
                  {subItem.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ease-in-out group transform hover:translate-x-1 ${
          isActive(item.path)
            ? "bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-500 translate-x-1"
            : ""
        }`}
      >
        <div
          className={`text-lg transition-colors duration-200 ${
            isActive(item.path)
              ? "text-blue-600"
              : "text-gray-500 group-hover:text-blue-600"
          }`}
        >
          {item.icon}
        </div>
        <span className="text-sm font-medium">{item.text}</span>
      </Link>
    );
  };

  const renderMenuSection = (section) => (
    <div key={section.title} className="mb-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-3 tracking-wider">
        {section.title}
      </h2>
      <div className="space-y-1">{section.items.map(renderMenuItem)}</div>
    </div>
  );

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <FaUserCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-gray-800">
            Sales Staff
          </h3>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {menuSections.map(renderMenuSection)}
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 
               bg-gradient-to-r from-blue-500 to-blue-600 
               text-white py-2 px-3 rounded-lg 
               hover:from-blue-600 hover:to-blue-700 
               transition-all duration-200 ease-in-out 
               transform hover:scale-105 shadow-sm hover:shadow-md"
        >
          <FaSignOutAlt className="text-xs" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default StaffSaleSidebar;
