import React, { useState } from "react";
import {
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Search,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TrackingOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fake data for order metrics
  const orderMetrics = [
    {
      title: "Tổng đơn hàng",
      value: "2,345",
      icon: <FileText />,
      path: "/admin/orders/all",
      ariaLabel: "Xem tất cả đơn hàng",
    },
    {
      title: "Đang xử lý",
      value: "789",
      icon: <Clock />,
      path: "/admin/orders/pending",
      ariaLabel: "Xem đơn hàng đang xử lý",
    },
    {
      title: "Đang giao",
      value: "456",
      icon: <Truck />,
      path: "/admin/orders/shipping",
      ariaLabel: "Xem đơn hàng đang giao",
    },
    {
      title: "Đã giao",
      value: "1,050",
      icon: <CheckCircle />,
      path: "/admin/orders/delivered",
      ariaLabel: "Xem đơn hàng đã giao",
    },
    {
      title: "Bị hủy",
      value: "50",
      icon: <XCircle />,
      path: "/admin/orders/canceled",
      ariaLabel: "Xem đơn hàng bị hủy",
    },
  ];

  // Fake data for order list
  const orderData = [
    {
      id: "ORD001",
      customer: "Nguyễn Văn A",
      status: "Đang xử lý",
      date: "2025-09-25",
      total: "3,500,000 VNĐ",
      icon: <Clock />,
      path: "/admin/orders/ORD001",
      ariaLabel: "Xem chi tiết đơn hàng ORD001",
    },
    {
      id: "ORD002",
      customer: "Trần Thị B",
      status: "Đang giao",
      date: "2025-09-24",
      total: "2,800,000 VNĐ",
      icon: <Truck />,
      path: "/admin/orders/ORD002",
      ariaLabel: "Xem chi tiết đơn hàng ORD002",
    },
    {
      id: "ORD003",
      customer: "Lê Văn C",
      status: "Đã giao",
      date: "2025-09-23",
      total: "4,200,000 VNĐ",
      icon: <CheckCircle />,
      path: "/admin/orders/ORD003",
      ariaLabel: "Xem chi tiết đơn hàng ORD003",
    },
    {
      id: "ORD004",
      customer: "Phạm Thị D",
      status: "Bị hủy",
      date: "2025-09-22",
      total: "1,900,000 VNĐ",
      icon: <XCircle />,
      path: "/admin/orders/ORD004",
      ariaLabel: "Xem chi tiết đơn hàng ORD004",
    },
    {
      id: "ORD005",
      customer: "Hoàng Văn E",
      status: "Đang xử lý",
      date: "2025-09-21",
      total: "5,000,000 VNĐ",
      icon: <Clock />,
      path: "/admin/orders/ORD005",
      ariaLabel: "Xem chi tiết đơn hàng ORD005",
    },
    {
      id: "ORD006",
      customer: "Vũ Thị F",
      status: "Đang giao",
      date: "2025-09-20",
      total: "2,300,000 VNĐ",
      icon: <Truck />,
      path: "/admin/orders/ORD006",
      ariaLabel: "Xem chi tiết đơn hàng ORD006",
    },
  ];

  // Filter orders based on search term
  const filteredOrders = orderData.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fake data for bar chart (orders by status)
  const chartData = {
    labels: ["Đang xử lý", "Đang giao", "Đã giao", "Bị hủy"],
    datasets: [
      {
        label: "Số lượng đơn hàng",
        data: [789, 456, 1050, 50],
        backgroundColor: "rgba(250, 204, 21, 0.6)",
        borderColor: "#facc15",
        borderWidth: 1,
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
        text: "Phân tích trạng thái đơn hàng (Tháng 9/2025)",
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
          beginAtZero: true,
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
            Theo Dõi Đơn Hàng
          </h1>
          <p className="text-gray-300 text-sm mt-3">
            Quản lý và theo dõi trạng thái các đơn hàng của bạn
          </p>
        </header>

        {/* Order Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {orderMetrics.map((metric, index) => (
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
              placeholder="Tìm kiếm đơn hàng theo mã, khách hàng hoặc trạng thái..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-gray-300 border border-yellow-500/30 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all"
              aria-label="Tìm kiếm đơn hàng"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Order List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => (window.location.href = order.path)}
                className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                aria-label={order.ariaLabel}
              >
                <div className="flex items-center space-x-4">
                  {React.cloneElement(order.icon, {
                    className: `w-8 h-8 ${
                      order.status === "Bị hủy"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`,
                  })}
                  <div>
                    <h2 className="text-sm font-semibold uppercase text-gray-300">
                      Đơn hàng {order.id}
                    </h2>
                    <p className="text-lg font-bold text-yellow-400 mt-1">
                      {order.status}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Khách hàng: {order.customer}
                    </p>
                    <p className="text-sm text-gray-400">
                      Ngày đặt: {order.date}
                    </p>
                    <p className="text-sm text-gray-400">
                      Tổng tiền: {order.total}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-gray-300 text-center col-span-full">
              Không tìm thấy đơn hàng nào phù hợp
            </p>
          )}
        </div>

        {/* Order Status Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
            Phân Tích Trạng Thái Đơn Hàng
          </h2>
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
            <Bar data={chartData} options={chartOptions} />
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
              onClick={() => (window.location.href = "/admin/orders/new")}
              aria-label="Tạo đơn hàng mới"
            >
              Tạo Đơn Hàng Mới
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/orders/filter")}
              aria-label="Lọc đơn hàng"
            >
              Lọc Đơn Hàng
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/orders/export")}
              aria-label="Xuất dữ liệu đơn hàng"
            >
              Xuất Dữ Liệu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrackingOrder;
