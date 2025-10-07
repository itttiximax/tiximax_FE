import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart2,
  Users,
  UserCheck,
  CreditCard,
  Truck,
  MapPin,
  Box,
  Globe,
  ShoppingCart,
  LogOut,
  FileText,
  Speaker,
  ChevronDown,
  List,
  UserRoundPlus,
  BookKey,
} from "lucide-react";

const ManagerSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [openCost, setOpenCost] = useState(false);

  const menuSections = [
    {
      title: t("Phân tích & Quản lý"),
      items: [
        {
          text: t("Thống kê"),
          icon: <BarChart2 />,
          path: "/manager/dashboard",
        },
        {
          text: t("Danh sách đơn hàng"),
          icon: <ShoppingCart />,
          path: "/manager/order",
        },
        {
          text: "Danh sách nhân viên",
          icon: <List />,
          path: "/manager/team",
        },
        {
          text: t("Danh sách khách hàng"),
          icon: <Users />,
          path: "/manager/customers",
        },
        {
          text: t("Cấp quyền"),
          icon: <BookKey />,
          path: "/manager/permission",
        },
        {
          text: t("Thành viên"),
          icon: <UserCheck />,
          path: "/manager/stafflead",
        },
        {
          text: t("Tạo nhân viên"),
          icon: <UserRoundPlus />,
          path: "/manager/createstaff",
        },
      ],
    },
    {
      title: t("pages"),
      items: [
        {
          text: t("Báo giá"),
          icon: <FileText />,
          path: "/manager/quote",
        },
        {
          text: t("marketing"),
          icon: <Speaker />,
          path: "/manager/ads",
        },
      ],
    },
    {
      title: t("management"),
      items: [
        {
          text: t("Thanh toán"),
          icon: <CreditCard />,
          hasSubmenu: true,
          isOpen: openCost,
          onToggle: () => setOpenCost(!openCost),
          submenuItems: [
            { text: t("paylater"), path: "/manager/cost/paylater" },
            { text: t("paybefore"), path: "/manager/cost/paybefore" },
          ],
        },
        {
          text: t("Tuyến vận chuyển"),
          icon: <Truck />,
          path: "/manager/routes",
        },
        {
          text: t("Điểm đến"),
          icon: <MapPin />,
          path: "/manager/transfer",
        },
        {
          text: t("Loại sản phẩm"),
          icon: <Box />,
          path: "/manager/producttype",
        },
        {
          text: t("website"),
          icon: <Globe />,
          path: "/manager/website",
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
            className={`flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 ${
              item.isOpen ? "bg-blue-50 dark:bg-blue-900" : ""
            }`}
            aria-expanded={item.isOpen}
            aria-label={`${t("aria.toggle")} ${item.text}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-400">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                item.isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`ml-8 mt-1 space-y-1 transition-all duration-300 ${
              item.isOpen
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {item.submenuItems.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={`block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200 ${
                  isActive(subItem.path)
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : ""
                }`}
                aria-label={`${t("aria.navigateTo")} ${subItem.text}`}
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
        className={`flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200 ${
          isActive(item.path)
            ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            : ""
        }`}
        aria-label={`${t("aria.navigateTo")} ${item.text}`}
      >
        <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
        <span className="text-sm font-medium">{item.text}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 shadow-md flex flex-col border-r border-gray-200/60 dark:border-gray-700/60">
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {section.title}
            </h2>
            <div className="space-y-1">{section.items.map(renderMenuItem)}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200/60 dark:border-gray-700/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
          aria-label={t("aria.logout")}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;
