import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ManagerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // hoặc role nếu bạn có lưu
    navigate("/signin");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Manager Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/manager/dashboard" className="hover:text-yellow-400">
          Dashboard
        </Link>
        <Link to="/manager/team" className="hover:text-yellow-400">
          Team Management
        </Link>
        <Link to="/manager/reports" className="hover:text-yellow-400">
          Reports
        </Link>
        <Link to="/manager/settings" className="hover:text-yellow-400">
          Settings
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

export default ManagerSidebar;
