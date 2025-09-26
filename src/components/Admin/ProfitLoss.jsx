import React, { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Calculator,
  Wallet,
  FileText,
  Search,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ProfitLoss = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fake data for profit/loss metrics
  const profitLossMetrics = [
    {
      title: "Tổng lợi nhuận",
      value: "1,200,000,000 VNĐ",
      icon: <TrendingUp />,
      path: "/admin/profit-loss/profit",
      ariaLabel: "Xem tổng lợi nhuận",
    },
    {
      title: "Tổng lỗ",
      value: "300,000,000 VNĐ",
      icon: <AlertTriangle />,
      path: "/admin/profit-loss/loss",
      ariaLabel: "Xem tổng lỗ",
    },
    {
      title: "Lợi nhuận ròng",
      value: "900,000,000 VNĐ",
      icon: <Calculator />,
      path: "/admin/profit-loss/net",
      ariaLabel: "Xem lợi nhuận ròng",
    },
    {
      title: "Chi phí hoạt động",
      value: "450,000,000 VNĐ",
      icon: <Wallet />,
      path: "/admin/profit-loss/expenses",
      ariaLabel: "Xem chi phí hoạt động",
    },
  ];

  // Fake data for profit/loss list
  const profitLossData = [
    {
      id: "PL001",
      category: "Bán hàng",
      amount: "800,000,000 VNĐ",
      type: "Lợi nhuận",
      icon: <TrendingUp />,
      path: "/admin/profit-loss/PL001",
      ariaLabel: "Xem chi tiết PL001",
    },
    {
      id: "PL002",
      category: "Dịch vụ",
      amount: "400,000,000 VNĐ",
      type: "Lợi nhuận",
      icon: <TrendingUp />,
      path: "/admin/profit-loss/PL002",
      ariaLabel: "Xem chi tiết PL002",
    },
    {
      id: "PL003",
      category: "Chi phí cố định",
      amount: "250,000,000 VNĐ",
      type: "Lỗ",
      icon: <AlertTriangle />,
      path: "/admin/profit-loss/PL003",
      ariaLabel: "Xem chi tiết PL003",
    },
    {
      id: "PL004",
      category: "Quảng cáo",
      amount: "50,000,000 VNĐ",
      type: "Lỗ",
      icon: <AlertTriangle />,
      path: "/admin/profit-loss/PL004",
      ariaLabel: "Xem chi tiết PL004",
    },
  ];

  // Filter profit/loss items based on search term
  const filteredItems = profitLossData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fake data for pie chart (profit/loss distribution)
  const chartData = {
    labels: ["Bán hàng", "Dịch vụ", "Chi phí cố định", "Quảng cáo"],
    datasets: [
      {
        data: [800000000, 400000000, 250000000, 50000000],
        backgroundColor: ["#facc15", "#fde047", "#ef4444", "#f87171"],
        borderColor: ["#facc15", "#fde047", "#ef4444", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#d1d5db",
        },
      },
      title: {
        display: true,
        text: "Phân phối Lợi nhuận và Lỗ (2025)",
        color: "#facc15",
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-yellow-300">
            Phân Tích Lợi Nhuận và Lỗ
          </h1>
          <p className="text-gray-300 text-sm mt-3">
            Theo dõi và phân tích lợi nhuận, lỗ và chi phí
          </p>
        </header>

        {/* Profit/Loss Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {profitLossMetrics.map((metric, index) => (
            <button
              key={index}
              onClick={() => (window.location.href = metric.path)}
              className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              aria-label={metric.ariaLabel}
            >
              <div className="flex items-center space-x-4">
                {React.cloneElement(metric.icon, {
                  className: "w-8 h-8 text-yellow-400",
                })}
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-300">
                    {metric.title}
                  </h2>
                  <p className="text-2xl font-bold text-yellow-400 mt-2">
                    {metric.value}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, danh mục hoặc loại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-gray-300 border border-yellow-500/30 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all"
              aria-label="Tìm kiếm lợi nhuận/lỗ"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Profit/Loss List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => (window.location.href = item.path)}
                className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                aria-label={item.ariaLabel}
              >
                <div className="flex items-center space-x-4">
                  {React.cloneElement(item.icon, {
                    className: `w-8 h-8 ${
                      item.type === "Lỗ" ? "text-red-400" : "text-yellow-400"
                    }`,
                  })}
                  <div>
                    <h2 className="text-sm font-semibold uppercase text-gray-300">
                      {item.category} ({item.id})
                    </h2>
                    <p className="text-lg font-bold text-yellow-400 mt-1">
                      {item.type}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Số tiền: {item.amount}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-gray-300 text-center col-span-full">
              Không tìm thấy khoản nào phù hợp
            </p>
          )}
        </div>

        {/* Profit/Loss Pie Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
            Biểu Đồ Phân Phối Lợi Nhuận và Lỗ
          </h2>
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4 h-64">
            <Pie data={chartData} options={chartOptions} />
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
              onClick={() =>
                (window.location.href = "/admin/profit-loss/reports")
              }
              aria-label="Xem báo cáo chi tiết"
            >
              Xem Báo Cáo Chi Tiết
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/profit-loss/forecast")
              }
              aria-label="Dự báo lợi nhuận/lỗ"
            >
              Dự Báo Lợi Nhuận/Lỗ
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/profit-loss/export")
              }
              aria-label="Xuất dữ liệu"
            >
              Xuất Dữ Liệu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfitLoss;
