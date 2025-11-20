import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, TrendingUp, Boxes, AlertTriangle } from "lucide-react";

const DashboardWarehouse = () => {
  // Data
  const inventoryData = [
    { category: "Electronics", stock: 4850, lowStock: 520 },
    { category: "Smartphones", stock: 3200, lowStock: 380 },
    { category: "Laptops", stock: 1650, lowStock: 220 },
    { category: "Accessories", stock: 5400, lowStock: 650 },
    { category: "Clothing", stock: 8200, lowStock: 1200 },
    { category: "Men's Wear", stock: 3500, lowStock: 450 },
    { category: "Women's Wear", stock: 3200, lowStock: 420 },
    { category: "Kids Clothing", stock: 1500, lowStock: 330 },
    { category: "Books", stock: 6700, lowStock: 800 },
    { category: "Textbooks", stock: 2800, lowStock: 350 },
    { category: "Fiction", stock: 2100, lowStock: 280 },
    { category: "Reference", stock: 1800, lowStock: 250 },
  ];

  const salesData = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 38000 },
    { month: "Mar", sales: 52000 },
    { month: "Apr", sales: 48500 },
    { month: "May", sales: 61000 },
    { month: "Jun", sales: 58000 },
    { month: "Jul", sales: 72000 },
    { month: "Aug", sales: 68500 },
    { month: "Sep", sales: 81000 },
    { month: "Oct", sales: 76500 },
    { month: "Nov", sales: 95000 },
    { month: "Dec", sales: 102000 },
  ];

  const productDistribution = [
    { name: "Electronics", value: 18 },
    { name: "Clothing", value: 28 },
    { name: "Books", value: 16 },
    { name: "Furniture", value: 12 },
    { name: "Groceries", value: 20 },
    { name: "Other", value: 6 },
  ];

  const categoryPerformance = [
    { name: "Electronics", revenue: 28500, growth: 12.5 },
    { name: "Clothing", revenue: 42300, growth: 8.2 },
    { name: "Books", revenue: 18900, growth: 5.1 },
    { name: "Furniture", revenue: 16800, growth: -2.3 },
    { name: "Groceries", revenue: 35200, growth: 15.8 },
    { name: "Other", revenue: 8200, growth: 22.4 },
  ];

  const topProducts = [
    { product: "Wireless Earbuds Pro", sales: 1240, revenue: 74400 },
    { product: "Cotton T-Shirt Pack", sales: 3200, revenue: 64000 },
    { product: "Bestseller Novel", sales: 892, revenue: 17840 },
    { product: "Office Chair", sales: 156, revenue: 23400 },
    { product: "Organic Coffee", sales: 2150, revenue: 32250 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
          <p className="text-xs font-medium text-gray-900">
            {payload[0].payload.category || payload[0].payload.month}
          </p>
          <p className="text-xs text-gray-600">
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalItems = inventoryData.reduce((sum, item) => sum + item.stock, 0);
  const totalLowStock = inventoryData.reduce(
    (sum, item) => sum + item.lowStock,
    0
  );

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="p-6  min-h-screen">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Boxes size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">
              Tổng Quan Kho Hàng
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Doanh thu</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${(totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Tổng sản phẩm
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(totalItems / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Boxes className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Danh mục</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inventoryData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Sắp hết hàng
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(totalLowStock / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart - Inventory */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Mức Tồn Kho Theo Danh Mục
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={inventoryData}
              margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="category"
                stroke="#6b7280"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lowStock" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Tồn kho hiện tại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Ngưỡng cảnh báo</span>
            </div>
          </div>
        </div>

        {/* Two Medium Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Sales Trend */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Xu Hướng Doanh Thu (12 Tháng)
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Phân Phối Sản Phẩm
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                  fontSize={11}
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Hiệu Suất Theo Danh Mục
            </h2>
            <div className="space-y-3">
              {categoryPerformance.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${(cat.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      cat.growth >= 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {cat.growth >= 0 ? "+" : ""}
                    {cat.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Top 5 Sản Phẩm Bán Chạy
            </h2>
            <div className="space-y-3">
              {topProducts.map((prod, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {prod.product}
                      </p>
                      <p className="text-xs text-gray-500">
                        {prod.sales} đơn vị
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      ${(prod.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWarehouse;
