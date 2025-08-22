import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xoá token/role nếu có lưu trong localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Điều hướng về trang signin
    navigate("/signin");
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
        Admin Panel
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-3">
        <Link
          to="/admin/dashboard"
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/orders"
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          Orders
        </Link>
        <Link
          to="/admin/staff"
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          Staff
        </Link>
        <Link
          to="/admin/customers"
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          Customers
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
