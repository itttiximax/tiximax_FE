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

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Lead Sale Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link
          to="/lead-sale/dashboard"
          className={
            isActive("/leadsale/dashboard")
              ? "bg-blue-600 p-2 rounded"
              : "hover:text-blue-300"
          }
        >
          Dashboard
        </Link>
        <Link
          to="/lead-sale/team"
          className={
            isActive("/leadsale/team")
              ? "bg-blue-600 p-2 rounded"
              : "hover:text-blue-300"
          }
        >
          Quản lý Team
        </Link>
        <Link
          to="/lead-sale/sales-report"
          className={
            isActive("/leadsale/sales-report")
              ? "bg-blue-600 p-2 rounded"
              : "hover:text-blue-300"
          }
        >
          Báo cáo doanh số
        </Link>
        <Link
          to="/manager/team"
          className={
            isActive("/manager/team")
              ? "bg-green-600 p-2 rounded"
              : "hover:text-green-300"
          }
        >
          Manager Team
        </Link>
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
