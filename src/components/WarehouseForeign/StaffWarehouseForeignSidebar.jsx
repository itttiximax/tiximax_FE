import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PackageOpen,
  PackageCheck,
  ListChecks,
  Package,
  ClipboardCheck,
  BarChart,
  User,
  Menu,
  X,
  FolderOutput,
  PackagePlus,
  Plane,
  Warehouse,
  LogOut,
} from "lucide-react";

const StaffWarehouseForeignSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuGroups = [
    {
      title: "Dashboard",
      items: [
        {
          text: "Tổng quan",
          icon: <LayoutDashboard className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/dashboard",
        },
        {
          text: "Kho",
          icon: <Warehouse className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/warehouse",
        },
      ],
    },
    {
      title: "Inbound (Nhập kho)",
      items: [
        {
          text: "Nhập kho",
          icon: <PackagePlus className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/imports",
        },
        {
          text: "Đóng gói",
          icon: <PackageOpen className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/packings",
        },
      ],
    },
    {
      title: "Outbound (Xuất kho)",
      items: [
        {
          text: "Hàng đủ điều kiện",
          icon: <PackageCheck className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/outbound/packingeligible",
        },
        {
          text: "Chờ chuyến bay",
          icon: <Plane className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/outbound/packingawaiting",
        },
        {
          text: "Lệnh xuất",
          icon: <FolderOutput className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/outbound/orders",
        },
        {
          text: "PackingInWarehouse List",
          icon: <FolderOutput className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/outbound/packinginwarehouse",
        },
      ],
    },
    {
      title: "Stock Management",
      items: [
        {
          text: "Serial Number",
          icon: <Package className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/stock/serial",
        },
        {
          text: "Vị trí hàng",
          icon: <Package className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/stock/location",
        },
      ],
    },
    {
      title: "Inventory Audit",
      items: [
        {
          text: "Kiểm kê",
          icon: <ListChecks className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/audit/check",
        },
        {
          text: "Đối chiếu",
          icon: <ClipboardCheck className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/audit/reconcile",
        },
      ],
    },
    {
      title: "Báo cáo & Thống kê",
      items: [
        {
          text: "Báo cáo nhập/xuất/tồn",
          icon: <BarChart className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/reports/dashboard",
        },
        {
          text: "Hiệu suất",
          icon: <BarChart className="w-5 h-5" />,
          path: "/staff-warehouse-foreign/reports/performance",
        },
      ],
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
            to="/staff-warehouse-foreign/profile"
            className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
              isActive("/staff-warehouse-foreign/profile")
                ? "bg-sky-100 text-sky-700 shadow-sm"
                : "text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <User
              className={`w-8 h-8 ${
                isActive("/staff-warehouse-foreign/profile")
                  ? "text-sky-600"
                  : "text-gray-500"
              }`}
            />
            <span className="text-sm font-semibold text-slate-800">
              Foreign Warehouse Staff
            </span>
          </Link>
        </div>

        {/* Menu Items with hidden scrollbar */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto hide-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
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
            </div>
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

export default StaffWarehouseForeignSidebar;
