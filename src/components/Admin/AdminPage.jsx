import React from "react";
import { FaClipboardList, FaUsers, FaChartLine, FaTruck } from "react-icons/fa";

const AdminPage = () => {
  const dashboardData = [
    {
      title: "Tổng đơn hàng",
      value: "1,234",
      icon: <FaClipboardList />,
      path: "/admin/orders",
    },
    {
      title: "Người dùng hoạt động",
      value: "567",
      icon: <FaUsers />,
      path: "/admin/staff",
    },
    {
      title: "Doanh thu hôm nay",
      value: "15,000,000 VNĐ",
      icon: <FaChartLine />,
      path: "/admin/revenue-analytics",
    },
    {
      title: "Phương tiện hoạt động",
      value: "45",
      icon: <FaTruck />,
      path: "/admin/vehicles",
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-300">
            Admin Dashboardd
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Chào mừng bạn đến với bảng điều khiển quản trị viên
          </p>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.map((item, index) => (
            <button
              key={index}
              onClick={() => (window.location.href = item.path)}
              className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-4 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              aria-label={`Xem chi tiết ${item.title}`}
            >
              <div className="flex items-center space-x-3">
                {React.cloneElement(item.icon, {
                  className: "w-6 h-6 text-yellow-400",
                })}
                <div>
                  <h2 className="text-xs font-medium uppercase">
                    {item.title}
                  </h2>
                  <p className="text-xl font-bold text-yellow-400 mt-1">
                    {item.value}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-yellow-300 mb-4">
            Hành động nhanh
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-6 py-3 rounded-lg text-black font-medium hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/orders/create")}
              aria-label="Tạo đơn hàng mới"
            >
              Tạo đơn hàng mới
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-6 py-3 rounded-lg text-black font-medium hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/pending-deliveries")
              }
              aria-label="Xem đơn hàng cần giao"
            >
              Xem đơn hàng cần giao
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-6 py-3 rounded-lg text-black font-medium hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/inventory")}
              aria-label="Kiểm tra tồn kho"
            >
              Kiểm tra tồn kho
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
