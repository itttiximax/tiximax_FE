import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiBarChart,
  FiUsers,
  FiUserCheck,
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiBox,
  FiGlobe,
  FiShoppingCart,
  FiLogOut,
  FiFileText,
  FiSpeaker,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

const ManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openCost, setOpenCost] = useState(false);

  const menuSections = [
    {
      title: "Phân tích",
      items: [
        { text: "Thống kê", icon: <FiBarChart />, path: "/manager/dashboard" },
        { text: "Nhóm", icon: <FiUserCheck />, path: "/manager/team" },
        { text: "Khách hàng", icon: <FiUsers />, path: "/manager/customers" },
      ],
    },
    {
      title: "Trang",
      items: [
        {
          text: "Báo giá",
          icon: <FiFileText />,
          path: "/manager/quote",
        },
        { text: "Marketing", icon: <FiSpeaker />, path: "/manager/ads" },
      ],
    },
    {
      title: "Quản lý",
      items: [
        {
          text: "Thanh toán",
          icon: <FiCreditCard />,
          hasSubmenu: true,
          isOpen: openCost,
          onToggle: () => setOpenCost(!openCost),
          submenuItems: [
            { text: "Thanh toán sau", path: "/manager/cost/paylater" },
            { text: "Thanh toán trước", path: "/manager/cost/paybefore" },
          ],
        },
        {
          text: "Tuyến vận chuyển",
          icon: <FiTruck />,
          path: "/manager/routes",
        },
        {
          text: "Điểm đến",
          icon: <FiMapPin />,
          path: "/manager/transfer",
        },
        {
          text: "Loại sản phẩm",
          icon: <FiBox />,
          path: "/manager/producttype",
        },
        {
          text: "Website",
          icon: <FiGlobe />,
          path: "/manager/website",
        },
        { text: "Đơn hàng", icon: <FiShoppingCart />, path: "/manager/order" },
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
            className={`flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              item.isOpen ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
            <FiChevronDown
              className={`text-xs transition-transform ${
                item.isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`ml-8 mt-1 space-y-1 transition-all ${
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
        className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
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
          <FiUser className="w-10 h-10 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">Manager</span>
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
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiLogOut className="text-xs" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;
