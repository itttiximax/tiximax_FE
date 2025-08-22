import React from "react";
import { Link } from "react-router-dom";

const StaffWarehouseForeignSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Kho Ngoại</h2>
      <nav className="space-y-3">
        <Link
          to="/staff/warehouse-foreign/dashboard"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Dashboard
        </Link>
        <Link
          to="/staff/warehouse-foreign/inventory"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Quản lý tồn kho
        </Link>
        <Link
          to="/staff/warehouse-foreign/import"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Nhập hàng
        </Link>
        <Link
          to="/staff/warehouse-foreign/export"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Xuất hàng
        </Link>
        <Link to="/signin" className="block hover:bg-red-600 p-2 rounded">
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default StaffWarehouseForeignSidebar;
