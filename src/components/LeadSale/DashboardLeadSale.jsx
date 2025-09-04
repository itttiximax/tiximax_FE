import React from "react";

const DashboardLeadSale = () => {
  // Logistics-specific data
  const stats = [
    { title: "Tổng số tài xế", value: 25, change: "+2", positive: true },
    { title: "Đơn hàng đang giao", value: 180, change: "-5", positive: false },
    { title: "Tổng số kho hàng", value: 8, change: "0", positive: true },
    {
      title: "Doanh thu vận chuyển",
      value: "$22,500",
      change: "+10%",
      positive: true,
    },
  ];

  const recentActivities = [
    { id: 1, action: "Thêm tài xế mới: Nguyễn Văn A", time: "5 phút trước" },
    {
      id: 2,
      action: "Cập nhật trạng thái đơn hàng #12345",
      time: "15 phút trước",
    },
    { id: 3, action: "Kiểm kê kho hàng tại Hà Nội", time: "45 phút trước" },
    { id: 4, action: "Tối ưu lộ trình giao hàng", time: "2 giờ trước" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br  p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 tracking-tight">
        Quản Lý Logistics
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-2xl bg-opacity-90 backdrop-blur-sm border border-indigo-100"
          >
            <h2 className="text-lg font-semibold text-indigo-600">
              {stat.title}
            </h2>
            <p className="text-3xl font-bold text-indigo-900 mt-3">
              {stat.value}
            </p>
            <p
              className={`text-sm mt-2 font-medium ${
                stat.positive ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 bg-opacity-95 backdrop-blur-sm border border-indigo-100">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
          Hoạt Động Gần Đây
        </h2>
        <ul className="space-y-4">
          {recentActivities.map((activity) => (
            <li
              key={activity.id}
              className="flex justify-between items-center border-b border-indigo-100 pb-4 hover:bg-indigo-50 transition-colors duration-200 rounded-lg px-3"
            >
              <span className="text-indigo-700 font-medium text-lg">
                {activity.action}
              </span>
              <span className="text-indigo-500 text-sm font-light">
                {activity.time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLeadSale;
