import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StaffWarehouseDomesticSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    {
      text: "Thống kê",
      icon: <BarChart className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/dashboard",
      title: "Xem số liệu tổng quan của kho nội địa",
    },
    {
      text: "Tồn kho",
      icon: <Package className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/inventory",
      title: "Quản lý hàng tồn kho",
    },
    {
      text: "Đơn hàng nhập kho",
      icon: <ArrowDown className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/imports",
      title: "Quản lý đơn hàng đang vận chuyển đến kho",
    },
    {
      text: "Đơn hàng xuất kho",
      icon: <ArrowUp className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/exports",
      title: "Quản lý đơn hàng nội địa sẵn sàng giao",
    },
    {
      text: "Đơn đủ điều kiện",
      icon: <PackageCheck className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/eligible-packings",
      title: "Quản lý đơn hàng đủ điều kiện đóng gói",
    },
    {
      text: "Kiểm kê kho",
      icon: <ClipboardCheck className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/inventory-check",
      title:
        "Hỗ trợ kiểm kê định kỳ hoặc đột xuất, quét mã và báo cáo chênh lệch",
    },
    {
      text: "Tra cứu sản phẩm",
      icon: <Search className="w-6 h-6" />,
      path: "/staff-warehouse-domestic/product-search",
      title: "Tra cứu theo mã, barcode, tên hàng và xem lịch sử nhập-xuất-tồn",
    },
    {
      text: "Báo cáo thống kê",
      icon: <FileSpreadsheet className="w-6 h-6" />,
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
    <div
      className={`${
        isExpanded ? "w-72" : "w-20"
      } bg-slate-50 shadow-lg flex flex-col h-screen transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="p-2 border-b border-gray-200 flex justify-end">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          title={isExpanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          ) : (
            <ChevronRight className="w-6 h-6 text-slate-600" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <Link
          to="/staff-warehouse-domestic/profile"
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors duration-200 ${
            isActive("/staff-warehouse-domestic/profile")
              ? "bg-sky-100 text-sky-700 shadow-sm"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <User
            className={`w-10 h-10 ${
              isActive("/staff-warehouse-domestic/profile")
                ? "text-sky-600"
                : "text-gray-500"
            }`}
          />
          <span
            className={`text-base font-semibold text-slate-800 text-center whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "opacity-100 max-h-10 translate-y-0"
                : "opacity-0 max-h-0 -translate-y-2"
            }`}
          >
            Nhân viên kho nội địa
          </span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            title={isExpanded ? item.title : item.text}
            className={`flex items-center py-3 pl-4 pr-4 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors duration-200 ${
              isActive(item.path)
                ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                : ""
            }`}
          >
            <span
              className={`flex-shrink-0 w-6 ${
                isActive(item.path) ? "text-sky-600" : "text-gray-500"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ml-3 ${
                isExpanded
                  ? "opacity-100 max-w-[200px]"
                  : "opacity-0 max-w-0 ml-0"
              }`}
            >
              {item.text}
            </span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center py-3 pl-4 pr-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          title={isExpanded ? "" : "Đăng xuất"}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className={`text-base font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ml-2 ${
              isExpanded
                ? "opacity-100 max-w-[200px]"
                : "opacity-0 max-w-0 ml-0"
            }`}
          >
            Đăng xuất
          </span>
        </button>
      </div>
    </div>
  );
};

export default StaffWarehouseDomesticSidebar;
