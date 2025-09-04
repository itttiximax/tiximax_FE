import React, { useState } from "react";
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
  ChevronDown,
  User,
  Package,
  UserCheck,
} from "lucide-react";

const LeadSaleSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: "LEADER SALE",
      highlighted: true,
      items: [
        {
          to: "/lead-sale/dashboard",
          icon: LayoutDashboard,
          label: "Báo cáo",
          color: "blue",
        },
        {
          to: "/lead-sale/team",
          icon: Users,
          label: "Quản lý Team",
          color: "blue",
        },
        {
          to: "/lead-sale/salesreport",
          icon: BarChart3,
          label: "Thống kê",
          color: "blue",
        },
      ],
    },
    {
      section: "Manager",
      highlighted: true,
      items: [
        {
          to: "/lead-sale/team",
          icon: Settings,
          label: "Manager Team",
          color: "brown",
        },
        {
          to: "/lead-sale/createorder",
          icon: ShoppingCart,
          label: "Tạo đơn hàng",
          color: "brown",
        },
        {
          to: "/lead-sale/createpayment",
          icon: BarChart3,
          label: "Tạo đơn thanh toán",
          color: "brown",
        },
        {
          type: "dropdown",
          icon: UserCheck,
          label: "Nhân viên",
          color: "brown",
          dropdownItems: [
            {
              to: "/lead-sale/warehouse-staff",
              icon: Package,
              label: "Nhân viên kho",
            },
            {
              to: "/lead-sale/sales-staff",
              icon: UserCheck,
              label: "Nhân viên sale",
            },
          ],
        },
        {
          to: "/lead-sale/destination",
          icon: MapPin,
          label: "Điểm đến",
          color: "brown",
        },
        {
          to: "/lead-sale/img",
          icon: MapPin,
          label: "Upload Ảnh",
          color: "brown",
        },
      ],
    },
  ];

  const getActiveColor = (color) => {
    switch (color) {
      case "navy":
        return "bg-gradient-to-r from-slate-600 via-slate-700 to-gray-700 text-white shadow-lg shadow-slate-500/20";
      case "brown":
        return "bg-gradient-to-r from-amber-700 via-orange-800 to-red-800 text-white shadow-lg shadow-amber-600/20";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg";
    }
  };

  const getHoverColor = (color) => {
    switch (color) {
      case "navy":
        return "hover:bg-gradient-to-r hover:from-slate-500/10 hover:to-gray-600/10 hover:text-slate-700 hover:border-slate-400/40 hover:shadow-md hover:shadow-slate-400/10";
      case "brown":
        return "hover:bg-gradient-to-r hover:from-amber-600/10 hover:to-orange-700/10 hover:text-amber-800 hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/10";
      default:
        return "hover:bg-gradient-to-r hover:from-gray-500/10 hover:to-gray-600/10 hover:text-gray-700";
    }
  };

  const renderMenuItem = (item, itemIndex) => {
    const Icon = item.icon;

    if (item.type === "dropdown") {
      const isDropdownActive = item.dropdownItems?.some((dropdownItem) =>
        isActive(dropdownItem.to)
      );

      return (
        <div key={itemIndex} className="space-y-1">
          <button
            onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
            className={`
              group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 border backdrop-blur-sm w-full
              ${
                isDropdownActive
                  ? getActiveColor(item.color) +
                    " transform scale-102 border-transparent"
                  : `text-gray-700 ${getHoverColor(
                      item.color
                    )} border-gray-200/40 bg-white/60 hover:scale-101 hover:bg-white/80`
              }
            `}
          >
            <div
              className={`
                p-1.5 rounded-lg transition-all duration-200
                ${
                  isDropdownActive
                    ? "bg-white/20 shadow-sm"
                    : "bg-gray-100/70 group-hover:bg-white/90 group-hover:shadow-sm"
                }
              `}
            >
              <Icon size={16} />
            </div>
            <span className="font-medium flex-1 text-xs text-left">
              {item.label}
            </span>
            <ChevronDown
              size={14}
              className={`
                transition-all duration-200
                ${isStaffDropdownOpen ? "rotate-180" : ""}
                ${
                  isDropdownActive
                    ? "opacity-100"
                    : "opacity-50 group-hover:opacity-80"
                }
              `}
            />
          </button>

          {/* Dropdown Items */}
          {isStaffDropdownOpen && (
            <div className="ml-4 space-y-1 border-l-2 border-gray-200/50 pl-2">
              {item.dropdownItems?.map((dropdownItem, dropdownIndex) => {
                const DropdownIcon = dropdownItem.icon;
                const dropdownActive = isActive(dropdownItem.to);

                return (
                  <Link
                    key={dropdownIndex}
                    to={dropdownItem.to}
                    className={`
                      group flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 border backdrop-blur-sm
                      ${
                        dropdownActive
                          ? getActiveColor(item.color) +
                            " transform scale-102 border-transparent"
                          : `text-gray-600 ${getHoverColor(
                              item.color
                            )} border-gray-200/30 bg-white/40 hover:scale-101 hover:bg-white/70`
                      }
                    `}
                  >
                    <div
                      className={`
                        p-1 rounded-md transition-all duration-200
                        ${
                          dropdownActive
                            ? "bg-white/20 shadow-sm"
                            : "bg-gray-100/50 group-hover:bg-white/80 group-hover:shadow-sm"
                        }
                      `}
                    >
                      <DropdownIcon size={14} />
                    </div>
                    <span className="font-medium flex-1 text-xs">
                      {dropdownItem.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item
    const active = isActive(item.to);

    return (
      <Link
        key={itemIndex}
        to={item.to}
        className={`
          group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 border backdrop-blur-sm
          ${
            active
              ? getActiveColor(item.color) +
                " transform scale-102 border-transparent"
              : `text-gray-700 ${getHoverColor(
                  item.color
                )} border-gray-200/40 bg-white/60 hover:scale-101 hover:bg-white/80`
          }
        `}
      >
        <div
          className={`
            p-1.5 rounded-lg transition-all duration-200
            ${
              active
                ? "bg-white/20 shadow-sm"
                : "bg-gray-100/70 group-hover:bg-white/90 group-hover:shadow-sm"
            }
          `}
        >
          <Icon size={16} />
        </div>
        <span className="font-medium flex-1 text-xs">{item.label}</span>
        <ChevronRight
          size={14}
          className={`
            transition-all duration-200
            ${
              active
                ? "opacity-100 transform translate-x-0.5"
                : "opacity-50 group-hover:opacity-80 group-hover:translate-x-0.5"
            }
          `}
        />
      </Link>
    );
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-br from-gray-50 via-stone-50 to-slate-100 text-gray-800 flex flex-col shadow-xl border-r border-gray-300/60 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-300/50 bg-white/70 backdrop-blur-md">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 via-slate-700 to-gray-800 rounded-xl flex items-center justify-center shadow-md shadow-slate-500/20">
              <User size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 bg-clip-text text-transparent">
              LeaderSale
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto bg-gradient-to-b from-white/50 to-stone-50/60 backdrop-blur-sm">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            <div
              className={`
              flex items-center gap-2 px-2 py-2 rounded-lg mb-2 transition-all duration-200
              ${
                section.highlighted
                  ? "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/50 shadow-sm"
                  : ""
              }
            `}
            >
              <h3
                className={`
                text-xs font-semibold uppercase tracking-wide flex items-center gap-2
                ${
                  section.highlighted
                    ? "text-blue-700 font-bold"
                    : "text-gray-600"
                }
              `}
              >
                <div
                  className={`
                  w-1.5 h-1.5 rounded-full
                  ${
                    section.highlighted
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm"
                      : "bg-gradient-to-r from-slate-500 to-gray-600"
                  }
                `}
                ></div>
                {section.section}
              </h3>
              {section.highlighted && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) =>
                renderMenuItem(item, itemIndex)
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-300/50 bg-white/70 backdrop-blur-md">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white py-2.5 px-3 rounded-lg font-semibold shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 transition-all duration-200 transform hover:scale-102 active:scale-98"
        >
          <LogOut size={16} />
          <span className="text-sm">Đăng xuất</span>
        </button>

        <div className="mt-3 text-center">
          <div className="mt-1.5 flex justify-center">
            <div className="w-6 h-0.5 bg-gradient-to-r from-slate-400 to-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
