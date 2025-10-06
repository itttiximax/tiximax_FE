import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Package,
  ArrowDown,
  ArrowUp,
  PackageCheck,
  ClipboardCheck,
  Search,
  FileSpreadsheet,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const StaffWarehouseDomesticSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      text: "Thống kê",
      icon: <BarChart className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/dashboard",
      title: "Xem số liệu tổng quan của kho nội địa",
    },
    {
      text: "Tồn kho",
      icon: <Package className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/inventory",
      title: "Quản lý hàng tồn kho",
    },
    {
      text: "Đơn hàng nhập kho",
      icon: <ArrowDown className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/imports",
      title: "Quản lý đơn hàng đang vận chuyển đến kho",
    },
    {
      text: "Đơn hàng xuất kho",
      icon: <ArrowUp className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/exports",
      title: "Quản lý đơn hàng nội địa sẵn sàng giao",
    },
    {
      text: "Đơn đủ điều kiện",
      icon: <PackageCheck className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/eligible-packings",
      title: "Quản lý đơn hàng đủ điều kiện đóng gói",
    },
    {
      text: "Kiểm kê kho",
      icon: <ClipboardCheck className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/inventory-check",
      title:
        "Hỗ trợ kiểm kê định kỳ hoặc đột xuất, quét mã và báo cáo chênh lệch",
    },
    {
      text: "Tra cứu sản phẩm",
      icon: <Search className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/product-search",
      title: "Tra cứu theo mã, barcode, tên hàng và xem lịch sử nhập-xuất-tồn",
    },
    {
      text: "Báo cáo thống kê",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      path: "/staff-warehouse-domestic/reports",
      title: "Báo cáo nhập-xuất-tồn theo ngày/tháng, xuất file Excel/PDF",
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
        className="md:hidden fixed top-4 left-4 z-50 text-slate-700 p-2 rounded-lg bg-slate-50 shadow-md hover:bg-slate-100 transition-colors duration-200"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-50 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 h-screen`}
      >
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <Link
            to="/staff-warehouse-domestic/profile"
            className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
              isActive("/staff-warehouse-domestic/profile")
                ? "bg-sky-100 text-sky-700 shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <User
              className={`w-8 h-8 ${
                isActive("/staff-warehouse-domestic/profile")
                  ? "text-sky-600"
                  : "text-gray-500"
              }`}
            />
            <span className="text-sm font-semibold text-slate-800">
              Nhân viên kho nội địa
            </span>
          </Link>
        </div>

        {/* Menu Items with hidden scrollbar */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={item.title}
              className={`flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span
                className={`${
                  isActive(item.path) ? "text-sky-600" : "text-gray-500"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.text}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default StaffWarehouseDomesticSidebar;
