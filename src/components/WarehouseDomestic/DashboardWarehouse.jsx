import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LineChart, Line } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const DashboardWarehouse = () => {
  // Expanded Inventory Data - Chi tiết và thực tế hơn
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
    { category: "Furniture", stock: 2400, lowStock: 340 },
    { category: "Office Furniture", stock: 1200, lowStock: 180 },
    { category: "Home Furniture", stock: 900, lowStock: 120 },
    { category: "Outdoor Furniture", stock: 300, lowStock: 40 },
    { category: "Groceries", stock: 12000, lowStock: 2200 },
    { category: "Fresh Produce", stock: 5600, lowStock: 1100 },
    { category: "Dairy Products", stock: 3200, lowStock: 680 },
    { category: "Pantry Items", stock: 3200, lowStock: 420 },
  ];

  // Realistic Monthly Sales Data (2023-2024)
  const salesData = [
    { month: "Jan 2023", sales: 45000, orders: 520 },
    { month: "Feb 2023", sales: 38000, orders: 480 },
    { month: "Mar 2023", sales: 52000, orders: 620 },
    { month: "Apr 2023", sales: 48500, orders: 580 },
    { month: "May 2023", sales: 61000, orders: 720 },
    { month: "Jun 2023", sales: 58000, orders: 680 },
    { month: "Jul 2023", sales: 72000, orders: 840 },
    { month: "Aug 2023", sales: 68500, orders: 800 },
    { month: "Sep 2023", sales: 81000, orders: 940 },
    { month: "Oct 2023", sales: 76500, orders: 890 },
    { month: "Nov 2023", sales: 95000, orders: 1100 },
    { month: "Dec 2023", sales: 102000, orders: 1180 },
    { month: "Jan 2024", sales: 54000, orders: 620 },
    { month: "Feb 2024", sales: 48000, orders: 560 },
    { month: "Mar 2024", sales: 63000, orders: 740 },
    { month: "Apr 2024", sales: 57500, orders: 680 },
    { month: "May 2024", sales: 71000, orders: 820 },
    { month: "Jun 2024", sales: 68000, orders: 780 },
  ];

  // Detailed Product Distribution
  const productDistribution = [
    { name: "Electronics", value: 18 },
    { name: "Clothing", value: 28 },
    { name: "Books", value: 16 },
    { name: "Furniture", value: 12 },
    { name: "Groceries", value: 20 },
    { name: "Home & Garden", value: 6 },
  ];

  // Category Performance Data
  const categoryPerformance = [
    { name: "Electronics", revenue: 28500, growth: 12.5 },
    { name: "Clothing", revenue: 42300, growth: 8.2 },
    { name: "Books", revenue: 18900, growth: 5.1 },
    { name: "Furniture", revenue: 16800, growth: -2.3 },
    { name: "Groceries", revenue: 35200, growth: 15.8 },
    { name: "Home & Garden", revenue: 8200, growth: 22.4 },
  ];

  // Top Products
  const topProducts = [
    { product: "Wireless Earbuds Pro", sales: 1240, revenue: 74400 },
    { product: "Cotton T-Shirt Pack", sales: 3200, revenue: 64000 },
    { product: "Bestseller Novel", sales: 892, revenue: 17840 },
    { product: "Office Chair", sales: 156, revenue: 23400 },
    { product: "Organic Coffee Beans", sales: 2150, revenue: 32250 },
  ];

  // Custom Tooltip cho Bar Chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
          <p className="font-semibold">{`${payload[0].payload.category}`}</p>
          <p>{`Current Stock: ${payload[0].value.toLocaleString()}`}</p>
          {payload[1] && (
            <p>{`Low Stock: ${payload[1].value.toLocaleString()}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip cho Line Chart
  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
          <p className="font-semibold">{`${payload[0].payload.month}`}</p>
          <p>{`Sales: $${payload[0].value.toLocaleString()}`}</p>
          {payload[0].payload.orders && (
            <p>{`Orders: ${payload[0].payload.orders}`}</p>
          )}
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

  return (
    <div className="min-h-screen  p-6 font-sans">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl border border-white/20">
        <h1 className="text-5xl font-black text-black mb-6">
          📦 Warehouse Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center shadow-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-700">
              ${(totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-blue-600 font-medium mt-1">
              Total Revenue
            </div>
            <div className="text-xs text-blue-500 mt-2">Last 18 months</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center shadow-lg border border-green-200">
            <div className="text-3xl font-bold text-green-700">
              {(totalItems / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-green-600 font-medium mt-1">
              Total Items
            </div>
            <div className="text-xs text-green-500 mt-2">In stock</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl text-center shadow-lg border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700">
              {inventoryData.length}
            </div>
            <div className="text-sm text-yellow-600 font-medium mt-1">
              Categories
            </div>
            <div className="text-xs text-yellow-500 mt-2">Product types</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl text-center shadow-lg border border-red-200">
            <div className="text-3xl font-bold text-red-700">
              {(totalLowStock / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-red-600 font-medium mt-1">
              Low Stock
            </div>
            <div className="text-xs text-red-500 mt-2">Needs restock</div>
          </div>
        </div>
      </div>

      {/* Charts Layout: BIG TOP + 2 SMALL BOTTOM */}
      <div className="space-y-6">
        {/* 1. BIG Inventory Levels (Full Width) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            📊 Inventory Levels by Category
          </h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={inventoryData}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                stroke="#64748b"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="stock"
                fill="url(#stockGradient)"
                radius={[10, 10, 0, 0]}
                name="Current Stock"
              />
              <Bar
                dataKey="lowStock"
                fill="url(#lowStockGradient)"
                radius={[10, 10, 0, 0]}
                name="Low Stock Threshold"
              />
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient
                  id="lowStockGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. 2 SMALL Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend (Small) */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              📈 Sales Trend (18 Months)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="url(#salesGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: "#0891b2", strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution (Small) */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              🥧 Product Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                  labelStyle={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    fill: "#333",
                  }}
                >
                  {productDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#3b82f6",
                          "#ef4444",
                          "#10b981",
                          "#f59e0b",
                          "#8b5cf6",
                          "#06b6d4",
                        ][index]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Performance */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              💼 Category Performance
            </h2>
            <div className="space-y-3">
              {categoryPerformance.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${(cat.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cat.growth >= 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
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
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🏆 Top 5 Products
            </h2>
            <div className="space-y-3">
              {topProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600 text-sm">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-700 text-sm truncate">
                        {prod.product}
                      </p>
                      <p className="text-xs text-gray-500">
                        {prod.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800">
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
