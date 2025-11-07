import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Fake personal data
const userData = {
  name: "Nguyễn Văn A",
  role: "Nhân viên Sale",
  employeeId: "SALE001",
  email: "vana@example.com",
  phone: "0123456789",
  joinDate: "01/01/2023",
};

// Fake sales metrics
const salesMetrics = {
  totalRevenue: 150000000, // VND
  monthlyTarget: 200000000,
  salesCount: 120,
  averageSaleValue: 1250000,
  conversionRate: 65, // %
};

// Fake monthly revenue data for line chart
const monthlyRevenueData = {
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
      label: "Doanh thu (VND)",
      data: [
        10000000, 15000000, 20000000, 18000000, 22000000, 25000000, 30000000,
        28000000, 32000000, 35000000, 40000000, 45000000,
      ],
      borderColor: "rgba(59, 130, 246, 1)", // blue-500
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      tension: 0.4,
    },
  ],
};

// Fake product category sales for pie chart
const productCategoryData = {
  labels: ["Điện thoại", "Laptop", "Phụ kiện", "Máy tính bảng", "Khác"],
  datasets: [
    {
      data: [40, 25, 15, 10, 10],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    },
  ],
};

// Fake regional sales for bar chart
const regionalSalesData = {
  labels: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Hải Phòng"],
  datasets: [
    {
      label: "Doanh số (sản phẩm)",
      data: [50, 30, 20, 15, 10],
      backgroundColor: "rgba(59, 130, 246, 0.7)",
    },
  ],
};

// Fake recent sales data for table (lots of fake entries)
const recentSales = [
  {
    id: 1,
    customer: "Khách hàng A",
    product: "iPhone 14",
    value: 20000000,
    date: "2025-11-01",
    status: "Hoàn thành",
  },
  {
    id: 2,
    customer: "Khách hàng B",
    product: "MacBook Pro",
    value: 50000000,
    date: "2025-10-28",
    status: "Hoàn thành",
  },
  {
    id: 3,
    customer: "Khách hàng C",
    product: "Tai nghe AirPods",
    value: 5000000,
    date: "2025-10-25",
    status: "Đang xử lý",
  },
  {
    id: 4,
    customer: "Khách hàng D",
    product: "iPad Air",
    value: 15000000,
    date: "2025-10-20",
    status: "Hoàn thành",
  },
  {
    id: 5,
    customer: "Khách hàng E",
    product: "Sạc dự phòng",
    value: 1000000,
    date: "2025-10-15",
    status: "Hủy",
  },
  {
    id: 6,
    customer: "Khách hàng F",
    product: "Laptop Dell XPS",
    value: 30000000,
    date: "2025-10-10",
    status: "Hoàn thành",
  },
  {
    id: 7,
    customer: "Khách hàng G",
    product: "Điện thoại Samsung",
    value: 18000000,
    date: "2025-10-05",
    status: "Đang xử lý",
  },
  {
    id: 8,
    customer: "Khách hàng H",
    product: "Chuột Logitech",
    value: 800000,
    date: "2025-09-30",
    status: "Hoàn thành",
  },
  {
    id: 9,
    customer: "Khách hàng I",
    product: "Bàn phím cơ",
    value: 2000000,
    date: "2025-09-25",
    status: "Hoàn thành",
  },
  {
    id: 10,
    customer: "Khách hàng J",
    product: "Màn hình LG",
    value: 10000000,
    date: "2025-09-20",
    status: "Hủy",
  },
  {
    id: 11,
    customer: "Khách hàng K",
    product: "Router TP-Link",
    value: 1500000,
    date: "2025-09-15",
    status: "Hoàn thành",
  },
  {
    id: 12,
    customer: "Khách hàng L",
    product: "Ổ cứng SSD",
    value: 3000000,
    date: "2025-09-10",
    status: "Đang xử lý",
  },
  {
    id: 13,
    customer: "Khách hàng M",
    product: "Máy in Canon",
    value: 5000000,
    date: "2025-09-05",
    status: "Hoàn thành",
  },
  {
    id: 14,
    customer: "Khách hàng N",
    product: "Webcam Logitech",
    value: 2000000,
    date: "2025-08-30",
    status: "Hoàn thành",
  },
  {
    id: 15,
    customer: "Khách hàng O",
    product: "Bộ phát WiFi",
    value: 2500000,
    date: "2025-08-25",
    status: "Hủy",
  },
  // Add more fake data as needed...
];

const LeadSalePage = () => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="min-h-screen p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Thống kê cá nhân </h1>
      </header>
      {/* Personal Information - Enhanced professional table layout with borders and hover effects */}
      <section className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Thông Tin Cá Nhân
        </h2>
        <table className="min-w-full table-auto border-collapse text-sm">
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">Tên:</td>
              <td className="px-4 py-2 text-gray-900">{userData.name}</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">Chức vụ:</td>
              <td className="px-4 py-2 text-gray-900">{userData.role}</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">
                Mã nhân viên:
              </td>
              <td className="px-4 py-2 text-gray-900">{userData.employeeId}</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">Email:</td>
              <td className="px-4 py-2 text-gray-900">{userData.email}</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">
                Số điện thoại:
              </td>
              <td className="px-4 py-2 text-gray-900">{userData.phone}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">
                Ngày tham gia:
              </td>
              <td className="px-4 py-2 text-gray-900">{userData.joinDate}</td>
            </tr>
          </tbody>
        </table>
      </section>
      {/* Sales Metrics - Smaller cards */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-800">
            Tổng Doanh Thu
          </h3>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(salesMetrics.totalRevenue)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-800">
            Mục Tiêu Tháng
          </h3>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(salesMetrics.monthlyTarget)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-800">Số Lượng Bán</h3>
          <p className="text-lg font-bold text-blue-600">
            {salesMetrics.salesCount}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-800">
            Giá Trị Trung Bình
          </h3>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(salesMetrics.averageSaleValue)}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h3 className="text-sm font-semibold text-gray-800">
            Tỷ Lệ Chuyển Đổi
          </h3>
          <p className="text-lg font-bold text-blue-600">
            {salesMetrics.conversionRate}%
          </p>
        </div>
      </section>
      {/* Charts Section - Reduced sizes with fixed heights, smaller fonts */}
      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Monthly Revenue Line Chart - Smaller height */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-base font-semibold text-gray-800">
            Doanh Thu Hàng Tháng
          </h2>
          <div className="h-[250px]">
            <Line
              data={monthlyRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top", labels: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>
        {/* Product Category Pie Chart - Smaller height */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-2 text-base font-semibold text-gray-800">
            Phân Loại Sản Phẩm
          </h2>
          <div className="h-[250px]">
            <Pie
              data={productCategoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right", labels: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>
        {/* Regional Sales Bar Chart - Slightly larger for col-span but still reduced */}
        <div className="rounded-lg bg-white p-4 shadow-md lg:col-span-2">
          <h2 className="mb-2 text-base font-semibold text-gray-800">
            Doanh Số Theo Khu Vực
          </h2>
          <div className="h-[300px]">
            <Bar
              data={regionalSalesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top", labels: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>
      </section>
      {/* Recent Sales Table - Smaller text and paddings */}
      <section className="rounded-lg bg-white p-4 shadow-md">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Các Đơn Hàng Gần Đây
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-1 text-left">ID</th>
                <th className="px-3 py-1 text-left">Khách Hàng</th>
                <th className="px-3 py-1 text-left">Sản Phẩm</th>
                <th className="px-3 py-1 text-left">Giá Trị</th>
                <th className="px-3 py-1 text-left">Ngày</th>
                <th className="px-3 py-1 text-left">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-t">
                  <td className="px-3 py-1">{sale.id}</td>
                  <td className="px-3 py-1">{sale.customer}</td>
                  <td className="px-3 py-1">{sale.product}</td>
                  <td className="px-3 py-1">{formatCurrency(sale.value)}</td>
                  <td className="px-3 py-1">{sale.date}</td>
                  <td className="px-3 py-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        sale.status === "Hoàn thành"
                          ? "bg-green-100 text-green-700"
                          : sale.status === "Đang xử lý"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LeadSalePage;
