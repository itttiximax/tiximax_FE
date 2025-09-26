import React, { useState } from "react";
import {
  Users,
  DollarSign,
  CheckSquare,
  AlertOctagon,
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

const EmployeeKPI = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fake data for employee metrics
  const employeeMetrics = [
    {
      title: "Tổng nhân viên",
      value: "125",
      icon: <Users />,
      path: "/admin/employees/all",
      ariaLabel: "Xem tất cả nhân viên",
    },
    {
      title: "Doanh thu cá nhân",
      value: "450,000,000 VNĐ",
      icon: <DollarSign />,
      path: "/admin/employees/revenue",
      ariaLabel: "Xem doanh thu cá nhân",
    },
    {
      title: "Đơn hàng hoàn thành",
      value: "2,890",
      icon: <CheckSquare />,
      path: "/admin/employees/completed",
      ariaLabel: "Xem đơn hàng hoàn thành",
    },
    {
      title: "Vắng mặt",
      value: "15",
      icon: <AlertOctagon />,
      path: "/admin/employees/absent",
      ariaLabel: "Xem nhân viên vắng mặt",
    },
  ];

  // Fake data for employee list
  const employeeData = [
    {
      id: "EMP001",
      name: "Nguyễn Văn A",
      role: "Nhân viên bán hàng",
      revenue: "120,000,000 VNĐ",
      completedOrders: 750,
      status: "Hoạt động",
      icon: <CheckSquare />,
      path: "/admin/employees/EMP001",
      ariaLabel: "Xem chi tiết nhân viên EMP001",
    },
    {
      id: "EMP002",
      name: "Trần Thị B",
      role: "Quản lý kho",
      revenue: "85,000,000 VNĐ",
      completedOrders: 620,
      status: "Hoạt động",
      icon: <CheckSquare />,
      path: "/admin/employees/EMP002",
      ariaLabel: "Xem chi tiết nhân viên EMP002",
    },
    {
      id: "EMP003",
      name: "Lê Văn C",
      role: "Nhân viên giao hàng",
      revenue: "45,000,000 VNĐ",
      completedOrders: 300,
      status: "Vắng",
      icon: <AlertOctagon />,
      path: "/admin/employees/EMP003",
      ariaLabel: "Xem chi tiết nhân viên EMP003",
    },
    {
      id: "EMP004",
      name: "Phạm Thị D",
      role: "Nhân viên hỗ trợ",
      revenue: "200,000,000 VNĐ",
      completedOrders: "1,220",
      status: "Hoạt động",
      icon: <CheckSquare />,
      path: "/admin/employees/EMP004",
      ariaLabel: "Xem chi tiết nhân viên EMP004",
    },
  ];

  // Filter employees based on search term
  const filteredEmployees = employeeData.filter(
    (employee) =>
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fake data for bar chart (employee performance by month)
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
    ],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [
          30000000, 35000000, 40000000, 45000000, 50000000, 55000000, 60000000,
          65000000, 70000000,
        ],
        backgroundColor: "rgba(250, 204, 21, 0.6)",
        borderColor: "#facc15",
        borderWidth: 1,
      },
      {
        label: "Đơn hàng hoàn thành",
        data: [200, 250, 300, 350, 400, 450, 500, 550, 600],
        backgroundColor: "rgba(34, 197, 94, 0.6)",
        borderColor: "#22c55e",
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
        text: "Hiệu suất nhân viên (Năm 2025)",
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
          callback: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M VNĐ`;
            return value;
          },
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
            Bảng Điều Khiển Hiệu Suất Nhân Viên
          </h1>
          <p className="text-gray-300 text-sm mt-3">
            Theo dõi và phân tích hiệu suất của nhân viên
          </p>
        </header>

        {/* Employee Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {employeeMetrics.map((metric, index) => (
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
              placeholder="Tìm kiếm nhân viên theo mã, tên hoặc vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-gray-300 border border-yellow-500/30 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all"
              aria-label="Tìm kiếm nhân viên"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Employee List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => (window.location.href = employee.path)}
                className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                aria-label={employee.ariaLabel}
              >
                <div className="flex items-center space-x-4">
                  {React.cloneElement(employee.icon, {
                    className: `w-8 h-8 ${
                      employee.status === "Vắng"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`,
                  })}
                  <div>
                    <h2 className="text-sm font-semibold uppercase text-gray-300">
                      {employee.name} ({employee.id})
                    </h2>
                    <p className="text-lg font-bold text-yellow-400 mt-1">
                      {employee.status}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Vai trò: {employee.role}
                    </p>
                    <p className="text-sm text-gray-400">
                      Doanh thu: {employee.revenue}
                    </p>
                    <p className="text-sm text-gray-400">
                      Đơn hàng: {employee.completedOrders}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-gray-300 text-center col-span-full">
              Không tìm thấy nhân viên nào phù hợp
            </p>
          )}
        </div>

        {/* KPI Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
            Biểu Đồ Hiệu Suất Nhân Viên
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
              onClick={() => (window.location.href = "/admin/employees/new")}
              aria-label="Thêm nhân viên mới"
            >
              Thêm Nhân Viên Mới
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/employees/filter")}
              aria-label="Lọc nhân viên"
            >
              Lọc Nhân Viên
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/employees/export")}
              aria-label="Xuất báo cáo KPI"
            >
              Xuất Báo Cáo KPI
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeKPI;
