import React from "react";
import { DollarSign, TrendingUp, Calendar, FileText } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueDashboard = () => {
  // Fake data for revenue metrics
  const revenueData = [
    {
      title: "Doanh thu hôm nay",
      value: "5,200,000 VNĐ",
      icon: <DollarSign />,
      path: "/admin/revenue/daily",
      ariaLabel: "Xem doanh thu hôm nay",
    },
    {
      title: "Doanh thu tuần này",
      value: "32,500,000 VNĐ",
      icon: <TrendingUp />,
      path: "/admin/revenue/weekly",
      ariaLabel: "Xem doanh thu tuần này",
    },
    {
      title: "Doanh thu tháng này",
      value: "128,000,000 VNĐ",
      icon: <Calendar />,
      path: "/admin/revenue/monthly",
      ariaLabel: "Xem doanh thu tháng này",
    },
    {
      title: "Doanh thu năm 2025",
      value: "1,450,000,000 VNĐ",
      icon: <FileText />,
      path: "/admin/revenue/yearly",
      ariaLabel: "Xem doanh thu năm 2025",
    },
  ];

  // Fake data for line chart (monthly revenue for 2025)
  const chartData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [
          100000000, 120000000, 150000000, 130000000, 160000000, 170000000,
          180000000, 200000000, 210000000, 190000000, 220000000, 230000000,
        ],
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#d1d5db",
        },
      },
      title: {
        display: true,
        text: "Doanh thu hàng tháng năm 2025",
        color: "#facc15",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#d1d5db",
        },
      },
      y: {
        ticks: {
          color: "#d1d5db",
          callback: (value) => `${(value / 1000000).toFixed(0)}M VNĐ`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-yellow-300">
            Bảng Điều Khiển Doanh Thu
          </h1>
          <p className="text-gray-300 text-sm mt-3">
            Theo dõi và phân tích doanh thu của bạn theo thời gian
          </p>
        </header>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {revenueData.map((item, index) => (
            <button
              key={index}
              onClick={() => (window.location.href = item.path)}
              className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              aria-label={item.ariaLabel}
            >
              <div className="flex items-center space-x-4">
                {React.cloneElement(item.icon, {
                  className: "w-8 h-8 text-yellow-400",
                })}
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-300">
                    {item.title}
                  </h2>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">
                    {item.value}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Revenue Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
            Biểu Đồ Doanh Thu
          </h2>
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
            <Line data={chartData} options={chartOptions} />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
            Tác Vụ Nhanh
          </h2>
          <div className="flex flex-wrap gap-5">
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/revenue/reports")}
              aria-label="Xem báo cáo chi tiết"
            >
              Xem Báo Cáo Chi Tiết
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/revenue/export")}
              aria-label="Xuất dữ liệu doanh thu"
            >
              Xuất Dữ Liệu
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/revenue/compare")}
              aria-label="So sánh doanh thu"
            >
              So Sánh Doanh Thu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RevenueDashboard;
