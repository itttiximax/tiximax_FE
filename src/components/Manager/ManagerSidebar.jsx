import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaRoute,
  FaSignOutAlt,
} from "react-icons/fa";

const LeadSaleSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    {
      path: "/leadsale/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      path: "/leadsale/team",
      label: "Quản lý Team",
      icon: <FaUsers />,
    },
    {
      path: "/leadsale/sales-report",
      label: "Báo cáo doanh số",
      icon: <FaChartBar />,
    },
    {
      path: "/manager/routes",
      label: "Quản lý Route",
      icon: <FaRoute />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <img
          src="https://ui-avatars.com/api/?name=Manager"
          alt="Manager"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-xl font-semibold">Manager Panel</span>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded transition
              ${
                isActive(item.path)
                  ? "bg-blue-600 font-bold"
                  : "hover:bg-gray-700"
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 py-2 rounded hover:bg-red-700 transition"
        >
          <FaSignOutAlt />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
