import React from "react";

const DashboardLeadSale = () => {
  // Dữ liệu giả
  const stats = [
    { title: "Tổng số bác sĩ", value: 12 },
    { title: "Tổng số bệnh nhân", value: 240 },
    { title: "Lịch hẹn hôm nay", value: 18 },
    { title: "Doanh thu tháng", value: "$15,200" },
  ];

  const recentActivities = [
    { id: 1, action: "Thêm bác sĩ mới", time: "10 phút trước" },
    { id: 2, action: "Cập nhật lịch hẹn", time: "30 phút trước" },
    { id: 3, action: "Xóa bệnh nhân", time: "1 giờ trước" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Manager</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white text-gray-800 rounded-lg shadow p-4 text-center"
          >
            <h2 className="text-xl font-semibold">{stat.title}</h2>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activities */}
      <div className="bg-white text-gray-800 rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Hoạt động gần đây</h2>
        <ul className="space-y-2">
          {recentActivities.map((activity) => (
            <li
              key={activity.id}
              className="flex justify-between border-b pb-2"
            >
              <span>{activity.action}</span>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLeadSale;
