import React from "react";
import { Link } from "react-router-dom";

const StaffWarehouseDomesticSideBar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Kho Nội Địa
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/staff-warehouse-domestic/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          to="/staff-warehouse-domestic/inventory"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          Quản lý tồn kho
        </Link>
        <Link
          to="/staff-warehouse-domestic/imports"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          Nhập hàng
        </Link>
        <Link
          to="/staff-warehouse-domestic/exports"
          className="block px-4 py-2 rounded hover:bg-gray-700"
        >
          Xuất hàng
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/signin"
          className="block px-4 py-2 rounded bg-red-600 text-center hover:bg-red-700"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default StaffWarehouseDomesticSideBar;
