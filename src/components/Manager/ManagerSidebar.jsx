import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LeadSaleSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/leadsale/dashboard", label: "Dashboard", activeColor: "blue" },
    { path: "/leadsale/team", label: "Quản lý Team", activeColor: "blue" },
    {
      path: "/leadsale/sales-report",
      label: "Báo cáo doanh số",
      activeColor: "blue",
    },
    { path: "/manager/team", label: "Manager Team", activeColor: "green" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Lead Sale Panel</h2>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              isActive(item.path)
                ? `bg-${item.activeColor}-600 p-2 rounded`
                : `hover:text-${item.activeColor}-300`
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
