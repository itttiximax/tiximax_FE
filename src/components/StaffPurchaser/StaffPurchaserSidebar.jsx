// src/components/StaffPurchaserSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const StaffPurchaserSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      {/* Logo / Header */}
      <div className="p-4 text-center text-lg font-bold border-b border-gray-700">
        Staff Purchaser
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/staff-purchaser/dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/staff-purchaser/orders"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/staff-purchaser/suppliers"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Suppliers
            </Link>
          </li>
          <li>
            <Link
              to="/staff-purchaser/inventory"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Inventory
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <Link
          to="/signin"
          className="block px-4 py-2 bg-red-600 text-center rounded hover:bg-red-700"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default StaffPurchaserSidebar;
