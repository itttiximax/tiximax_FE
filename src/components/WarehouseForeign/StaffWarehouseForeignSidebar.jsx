import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PackageOpen,
  PackageCheck,
  ListChecks,
  Package,
  ClipboardCheck,
  BarChart,
  User,
  FolderOutput,
  PackagePlus,
  Plane,
  Warehouse,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logout from "../../Page/Logout";
import profileService from "../../Services/SharedService/profileService";

const StaffWarehouseForeignSidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getCurrentAccount();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);
  const menuGroups = [
    {
      title: "Dashboard",
      items: [
        {
          text: "Tổng quan",
          icon: <LayoutDashboard className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/dashboard",
        },
        {
          text: "Kho",
          icon: <Warehouse className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/warehouse",
        },
      ],
    },
    {
      title: "Inbound (Nhập kho)",
      items: [
        {
          text: "Nhập kho Indonesia",
          icon: <PackagePlus className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/imports",
        },
        {
          text: "Nhập kho",
          icon: <PackageCheck className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/importproduct",
        },
        {
          text: "Đóng gói",
          icon: <PackageOpen className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/packings",
        },
      ],
    },
    {
      title: "Outbound (Xuất kho)",
      items: [
        {
          text: "Hàng đủ điều kiện",
          icon: <PackageCheck className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/outbound/packingeligible",
        },
        {
          text: "Chờ chuyến bay",
          icon: <Plane className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/outbound/packingawaiting",
        },
        {
          text: "Lệnh xuất",
          icon: <FolderOutput className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/outbound/orders",
        },
        {
          text: "PackingInWarehouse List",
          icon: <FolderOutput className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/outbound/packinginwarehouse",
        },
      ],
    },
    {
      title: "Stock Management",
      items: [
        {
          text: "Serial Number",
          icon: <Package className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/stock/serial",
        },
        {
          text: "Vị trí hàng",
          icon: <Package className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/stock/location",
        },
      ],
    },
    {
      title: "Inventory Audit",
      items: [
        {
          text: "Kiểm kê",
          icon: <ListChecks className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/audit/check",
        },
        {
          text: "Đối chiếu",
          icon: <ClipboardCheck className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/audit/reconcile",
        },
      ],
    },
    {
      title: "Báo cáo & Thống kê",
      items: [
        {
          text: "Báo cáo nhập/xuất/tồn",
          icon: <BarChart className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/reports/dashboard",
        },
        {
          text: "Hiệu suất",
          icon: <BarChart className="w-6 h-6" />,
          path: "/staff-warehouse-foreign/reports/performance",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`${
        isExpanded ? "w-72" : "w-20"
      } bg-slate-50 shadow-lg flex flex-col h-screen transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="p-1 border-b border-gray-200 flex flex-shrink-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-200 transition-colors"
        >
          {isExpanded ? (
            <>
              <span className="text-sm font-medium text-slate-700 mx-auto">
                Nhân viên kho ngoại
              </span>
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </>
          ) : (
            <ChevronRight className="w-6 h-6 text-slate-600 mx-auto" />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <Link
          to="/staff-warehouse-foreign/profile"
          className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors duration-200 ${
            isActive("/staff-warehouse-foreign/profile")
              ? "bg-sky-100 text-sky-700 shadow-sm"
              : "text-slate-700 hover:bg-slate-200"
          }`}
        >
          <User
            className={`w-10 h-10 ${
              isActive("/staff-warehouse-foreign/profile")
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
            {profile?.name || "Đang tải..."}
          </span>
        </Link>
      </div>

      {/* Menu Items with hidden scrollbar */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto hide-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3
              className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isExpanded ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
              }`}
            >
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isExpanded ? "" : item.text}
                  className={`flex items-center py-3 pl-4 pr-4 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "bg-sky-100 text-sky-700 font-semibold shadow-sm"
                      : ""
                  }`}
                >
                  <span
                    className={`flex-shrink-0 ${
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
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-slate-50 sticky bottom-0">
        <div className="relative w-full">
          <Logout
            className={`relative w-full flex items-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
            iconSize={20}
            buttonText="" // không hiển thị text mặc định
            redirectTo="/signin"
            showIcon={true}
            useConfirm={true}
            confirmMessage="Bạn có chắc chắn muốn đăng xuất?"
          />
          {isExpanded && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-white">
              Đăng xuất
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffWarehouseForeignSidebar;
