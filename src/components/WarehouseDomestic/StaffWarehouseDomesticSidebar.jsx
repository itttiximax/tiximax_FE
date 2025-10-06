import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaBoxes,
  FaArrowDown,
  FaArrowUp,
  FaSignOutAlt,
  FaUserTie,
  FaPallet,
  FaClipboardCheck,
  FaSearch,
  FaFileExcel,
} from "react-icons/fa";

const StaffWarehouseDomesticSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Thống kê",
      icon: <FaChartBar />,
      path: "/staff-warehouse-domestic/dashboard",
      title: "Xem số liệu tổng quan của kho nội địa",
    },
    {
      text: "Tồn kho",
      icon: <FaBoxes />,
      path: "/staff-warehouse-domestic/inventory",
      title: "Quản lý hàng tồn kho",
    },
    {
      text: "Đơn hàng nhập kho",
      icon: <FaArrowDown />,
      path: "/staff-warehouse-domestic/imports",
      title: "Quản lý đơn hàng đang vận chuyển đến kho",
    },
    {
      text: "Đơn hàng xuất kho",
      icon: <FaArrowUp />,
      path: "/staff-warehouse-domestic/exports",
      title: "Quản lý đơn hàng nội địa sẵn sàng giao",
    },
    {
      text: "Đơn đủ điều kiện",
      icon: <FaPallet />,
      path: "/staff-warehouse-domestic/eligible-packings",
      title: "Quản lý đơn hàng đủ điều kiện đóng gói",
    },
    {
      text: "Kiểm kê kho",
      icon: <FaClipboardCheck />,
      path: "/staff-warehouse-domestic/inventory-check",
      title:
        "Hỗ trợ kiểm kê định kỳ hoặc đột xuất, quét mã và báo cáo chênh lệch",
    },
    {
      text: "Tra cứu sản phẩm",
      icon: <FaSearch />,
      path: "/staff-warehouse-domestic/product-search",
      title: "Tra cứu theo mã, barcode, tên hàng và xem lịch sử nhập-xuất-tồn",
    },
    {
      text: "Báo cáo thống kê",
      icon: <FaFileExcel />,
      path: "/staff-warehouse-domestic/reports",
      title: "Báo cáo nhập-xuất-tồn theo ngày/tháng, xuất file Excel/PDF",
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
        <div className="flex flex-col items-center gap-2">
          <FaUserTie className="w-8 h-8 text-blue-600" />
          <div className="text-center">
            <span className="text-sm font-semibold text-gray-800">
              Nhân viên kho nội địa
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items with hidden scrollbar */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={item.title}
            className={`flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg ${
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
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaSignOutAlt className="text-xs" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default StaffWarehouseDomesticSidebar;
