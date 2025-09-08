import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaShippingFast,
  FaCalculator,
  FaWarehouse,
  FaRoute,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
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
        {
          text: "Báo giá",
          icon: <FaCalculator />,
          path: "/staff-sale/quotations",
        },
      ],
    },
    {
      title: "Báo cáo",
      items: [
        {
          text: "Thống kê",
          icon: <FaChartLine />,
          path: "/staff-sale/dashboard",
        },
      ],
    },
    {
      title: "Khách hàng",
      items: [
        {
          text: "Danh sách khách hàng",
          icon: <FaUsers />,
          path: "/staff-sale/customers",
        },
      ],
    },
    {
      title: "Đơn hàng",
      items: [
        {
          text: "Quản lý đơn hàng",
          icon: <FaBoxOpen />,
          hasSubmenu: true,
          isOpen: openOrders,
          onToggle: () => setOpenOrders(!openOrders),
          submenuItems: [
            { text: "Tất cả", path: "/staff-sale/orders" },
            { text: "Đang xử lý", path: "/staff-sale/orders/pending" },
          ],
        },
      ],
    },
    {
      title: "Vận chuyển",
      items: [
        {
          text: "Theo dõi vận chuyển",
          icon: <FaShippingFast />,
          hasSubmenu: true,
          isOpen: openLogistics,
          onToggle: () => setOpenLogistics(!openLogistics),
          submenuItems: [
            { text: "Khách lẻ", path: "/staff-sale/shipping/domestic" },
            {
              text: "Khách đại lý",
              path: "/staff-sale/shipping/international",
            },
          ],
        },
        { text: "Lộ trình", icon: <FaRoute />, path: "/staff-sale/tracking" },
        {
          text: "Kho hàng",
          icon: <FaWarehouse />,
          path: "/staff-sale/warehouses",
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
            className={`flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ${
              item.isOpen ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
            <FaChevronDown
              className={`text-xs transition-transform duration-150 ${
                item.isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`ml-8 mt-1 space-y-1 transition-all duration-200 ease-in-out ${
              item.isOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {item.submenuItems.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={`block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg ${
                  isActive(subItem.path) ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                {subItem.text}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <FaUserCircle className="w-8 h-8 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">
            Sales Staff
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">
              {section.title}
            </h2>
            <div className="space-y-1">{section.items.map(renderMenuItem)}</div>
          </div>
        ))}
      </div>

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

export default StaffSaleSidebar;
