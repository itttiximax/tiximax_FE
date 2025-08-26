import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaCalendarAlt,
  FaBell,
  FaSearch,
  FaFilter,
  FaDownload,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaUserCheck,
} from "react-icons/fa";

const ManagerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animationTrigger, setAnimationTrigger] = useState(false);

  // Fake data
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "2,847,329,000",
      unit: "VNĐ",
      change: "+12.5%",
      isPositive: true,
      icon: <FaMoneyBillWave />,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Đơn hàng mới",
      value: "1,248",
      unit: "đơn",
      change: "+8.2%",
      isPositive: true,
      icon: <FaShoppingCart />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Khách hàng",
      value: "18,492",
      unit: "người",
      change: "+15.3%",
      isPositive: true,
      icon: <FaUsers />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Tỉ lệ chuyển đổi",
      value: "3.24",
      unit: "%",
      change: "-2.1%",
      isPositive: false,
      icon: <FaChartLine />,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "Nguyễn Văn A",
      amount: "2,450,000",
      status: "completed",
      date: "2024-03-20",
    },
    {
      id: "#ORD-002",
      customer: "Trần Thị B",
      amount: "1,680,000",
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: "#ORD-003",
      customer: "Lê Văn C",
      amount: "3,200,000",
      status: "completed",
      date: "2024-03-19",
    },
    {
      id: "#ORD-004",
      customer: "Phạm Thị D",
      amount: "890,000",
      status: "cancelled",
      date: "2024-03-19",
    },
    {
      id: "#ORD-005",
      customer: "Hoàng Văn E",
      amount: "5,670,000",
      status: "completed",
      date: "2024-03-18",
    },
  ];

  const topProducts = [
    {
      name: "iPhone 15 Pro Max",
      sales: 342,
      revenue: "8,550,000,000",
      trend: "+23%",
    },
    {
      name: "Samsung Galaxy S24",
      sales: 298,
      revenue: "5,960,000,000",
      trend: "+18%",
    },
    {
      name: "MacBook Air M3",
      sales: 156,
      revenue: "4,680,000,000",
      trend: "+12%",
    },
    {
      name: "AirPods Pro",
      sales: 523,
      revenue: "3,138,000,000",
      trend: "+31%",
    },
    { name: "iPad Pro", sales: 198, revenue: "4,950,000,000", trend: "+15%" },
  ];

  const trafficSources = [
    {
      source: "Organic Search",
      visitors: 45230,
      percentage: 42.5,
      color: "bg-green-500",
    },
    {
      source: "Direct",
      visitors: 32180,
      percentage: 30.2,
      color: "bg-blue-500",
    },
    {
      source: "Social Media",
      visitors: 18950,
      percentage: 17.8,
      color: "bg-purple-500",
    },
    {
      source: "Email",
      visitors: 6420,
      percentage: 6.0,
      color: "bg-orange-500",
    },
    {
      source: "Referral",
      visitors: 3720,
      percentage: 3.5,
      color: "bg-pink-500",
    },
  ];

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setAnimationTrigger(true), 100);
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(clockTimer);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dashboard Analytics
            </h1>
            <p className="text-gray-600">
              Chào mừng trở lại! Hôm nay là{" "}
              {currentTime.toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-500">Thời gian hiện tại</p>
              <p className="text-lg font-semibold text-gray-800">
                {currentTime.toLocaleTimeString("vi-VN")}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105">
                <FaBell />
              </button>
              <button className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 hover:scale-105">
                <FaDownload />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105 ${
              animationTrigger ? "animate-slideInUp" : "opacity-0"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
              >
                {stat.icon}
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-2">{stat.title}</h3>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-gray-800">
                {stat.value}
              </span>
              <span className="text-gray-500 text-sm mb-1">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Đơn hàng gần đây
            </h2>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <FaSearch />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                <FaFilter />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {order.id.slice(-2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-500">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {order.amount} VNĐ
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Sản phẩm bán chạy
          </h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">{product.sales} bán</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {product.revenue}
                  </p>
                  <p className="text-xs text-green-600">{product.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Nguồn truy cập
          </h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {source.source}
                  </span>
                  <span className="text-sm text-gray-600">
                    {source.visitors.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 ${source.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: animationTrigger ? `${source.percentage}%` : "0%",
                      transitionDelay: `${index * 200}ms`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Thống kê nhanh
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <FaGlobe className="text-2xl text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">142</p>
              <p className="text-sm text-gray-600">Quốc gia</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <FaMobile className="text-2xl text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">68%</p>
              <p className="text-sm text-gray-600">Mobile</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <FaDesktop className="text-2xl text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">32%</p>
              <p className="text-sm text-gray-600">Desktop</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <FaUserCheck className="text-2xl text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">94.2%</p>
              <p className="text-sm text-gray-600">Hài lòng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
