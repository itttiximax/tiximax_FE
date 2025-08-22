// src/components/LeadSaleSideBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LeadSaleSideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xoá token (nếu có)
    navigate("/signin"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Lead Sale
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          <li>
            <Link
              to="/leadsale/dashboard"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/leadsale/team"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Quản lý Team
            </Link>
          </li>
          <li>
            <Link
              to="/leadsale/sales-report"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Báo cáo doanh số
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
