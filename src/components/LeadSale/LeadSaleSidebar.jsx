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
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed top-0 left-0 shadow-2xl">
      {/* Logo */}
      <div className="p-6 text-3xl font-extrabold border-b border-gray-800 flex items-center space-x-2">
        <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Lead Sale
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/leadsale/dashboard"
              className={`block p-3 rounded-lg transition-all duration-300 ${
                isActive("/leadsale/dashboard")
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-blue-300"
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Dashboard</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/leadsale/team"
              className={`block p-3 rounded-lg transition-all duration-300 ${
                isActive("/leadsale/team")
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-blue-300"
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>Quản lý Team</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/leadsale/sales-report"
              className={`block p-3 rounded-lg transition-all duration-300 ${
                isActive("/leadsale/sales-report")
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-blue-300"
              }`}
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10m6 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Báo cáo doanh số</span>
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeadSaleSideBar;
