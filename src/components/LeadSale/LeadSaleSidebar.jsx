import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ShoppingCart,
  Truck,
  MapPin,
  LogOut,
  ChevronRight,
  Star,
} from "lucide-react";

const LeadSaleSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: "Lead Sale",
      items: [
        {
          to: "/lead-sale/dashboard",
          icon: LayoutDashboard,
          label: "Dashboard",
          color: "blue",
        },
        {
          to: "/lead-sale/team",
          icon: Users,
          label: "Quản lý Team",
          color: "blue",
        },
        {
          to: "/lead-sale/sales-report",
          icon: BarChart3,
          label: "Báo cáo doanh số",
          color: "blue",
        },
      ],
    },
    {
      section: "Manager",
      items: [
        {
          to: "/lead-sale/team",
          icon: Settings,
          label: "Manager Team",
          color: "emerald",
        },
        {
          to: "/lead-sale/createorder",
          icon: ShoppingCart,
          label: "Tạo đơn hàng",
          color: "emerald",
        },
        {
          to: "/lead-sale/createpayment",
          icon: BarChart3,
          label: "Tạo đơn thanh toán",
          color: "emerald",
        },
        {
          to: "/lead-sale/product",
          icon: Settings,
          label: "Điểm đến",
          color: "emerald",
        },
        {
          to: "/lead-sale/destination",
          icon: MapPin,
          label: "Điểm đến",
          color: "emerald",
        },
      ],
    },
  ];

  const getActiveColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg";
      case "emerald":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getHoverColor = (color) => {
    switch (color) {
      case "blue":
        return "hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500";
      case "emerald":
        return "hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500";
      default:
        return "hover:bg-gray-700 hover:text-gray-300";
    }
  };

  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-15 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Star size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              LeaderSale
            </h2>
            <p className="text-slate-400 text-sm">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const active = isActive(item.to);

                return (
                  <Link
                    key={itemIndex}
                    to={item.to}
                    className={`
                      group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 border border-transparent
                      ${
                        active
                          ? getActiveColor(item.color) + " transform scale-105"
                          : `text-slate-300 ${getHoverColor(
                              item.color
                            )} border-slate-600/50`
                      }
                    `}
                  >
                    <div
                      className={`
                        p-2 rounded-lg transition-all duration-200
                        ${
                          active
                            ? "bg-white/20"
                            : "bg-slate-700/50 group-hover:bg-slate-600/70"
                        }
                      `}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="font-medium flex-1">{item.label}</span>
                    <ChevronRight
                      size={16}
                      className={`
                        transition-all duration-200
                        ${
                          active
                            ? "opacity-100 transform translate-x-1"
                            : "opacity-0 group-hover:opacity-70"
                        }
                      `}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
