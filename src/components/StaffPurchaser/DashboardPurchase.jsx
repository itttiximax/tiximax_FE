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

const DashboardPurchaser = () => {
  // Expanded Supplier Data - Chi tiết và thực tế hơn
  const purchaseData = [
    { supplier: "ABC Corp", orders: 145, value: 125000, deliveryRate: 94.5 },
    { supplier: "XYZ Ltd", orders: 132, value: 118000, deliveryRate: 91.2 },
    {
      supplier: "Tech Supplier",
      orders: 168,
      value: 242000,
      deliveryRate: 96.8,
    },
    { supplier: "Global Inc", orders: 178, value: 281000, deliveryRate: 93.4 },
    { supplier: "Local Vendor", orders: 98, value: 62000, deliveryRate: 88.6 },
    {
      supplier: "Premium Electronics",
      orders: 124,
      value: 198000,
      deliveryRate: 97.2,
    },
    {
      supplier: "Office Solutions",
      orders: 156,
      value: 89000,
      deliveryRate: 92.1,
    },
    {
      supplier: "Industrial Co",
      orders: 112,
      value: 145000,
      deliveryRate: 89.3,
    },
  ];

  // Realistic Monthly Spend Data (2023-2024)
  const monthlySpendData = [
    { month: "Jan 2023", spend: 55000, orders: 120, suppliers: 6 },
    { month: "Feb 2023", spend: 48000, orders: 108, suppliers: 6 },
    { month: "Mar 2023", spend: 62000, orders: 135, suppliers: 7 },
    { month: "Apr 2023", spend: 58000, orders: 128, suppliers: 7 },
    { month: "May 2023", spend: 72000, orders: 155, suppliers: 7 },
    { month: "Jun 2023", spend: 68000, orders: 148, suppliers: 7 },
    { month: "Jul 2023", spend: 85000, orders: 180, suppliers: 8 },
    { month: "Aug 2023", spend: 78000, orders: 165, suppliers: 8 },
    { month: "Sep 2023", spend: 92000, orders: 195, suppliers: 8 },
    { month: "Oct 2023", spend: 88000, orders: 185, suppliers: 8 },
    { month: "Nov 2023", spend: 105000, orders: 220, suppliers: 8 },
    { month: "Dec 2023", spend: 98000, orders: 205, suppliers: 8 },
    { month: "Jan 2024", spend: 62000, orders: 130, suppliers: 7 },
    { month: "Feb 2024", spend: 55000, orders: 118, suppliers: 7 },
    { month: "Mar 2024", spend: 71000, orders: 152, suppliers: 8 },
    { month: "Apr 2024", spend: 64000, orders: 138, suppliers: 7 },
    { month: "May 2024", spend: 81000, orders: 175, suppliers: 8 },
    { month: "Jun 2024", spend: 76000, orders: 162, suppliers: 8 },
  ];

  // Detailed Category Spend
  const categorySpend = [
    { name: "Electronics & IT", value: 32 },
    { name: "Office Supplies", value: 18 },
    { name: "Furniture", value: 15 },
    { name: "Raw Materials", value: 20 },
    { name: "Stationery", value: 8 },
    { name: "Other", value: 7 },
  ];

  // Supplier Performance Details
  const supplierPerformance = [
    {
      name: "Global Inc",
      avgLeadTime: "3.2 days",
      qualityScore: 98,
      costSavings: "12%",
    },
    {
      name: "Tech Supplier",
      avgLeadTime: "2.8 days",
      qualityScore: 96,
      costSavings: "8%",
    },
    {
      name: "ABC Corp",
      avgLeadTime: "4.1 days",
      qualityScore: 94,
      costSavings: "5%",
    },
    {
      name: "Premium Electronics",
      avgLeadTime: "3.5 days",
      qualityScore: 97,
      costSavings: "15%",
    },
    {
      name: "Office Solutions",
      avgLeadTime: "5.2 days",
      qualityScore: 92,
      costSavings: "3%",
    },
  ];

  // Top Purchase Orders
  const topPurchases = [
    {
      poNumber: "PO-2024-001",
      supplier: "Global Inc",
      amount: 45000,
      items: 245,
      status: "Delivered",
    },
    {
      poNumber: "PO-2024-002",
      supplier: "Tech Supplier",
      amount: 38500,
      items: 128,
      status: "In Transit",
    },
    {
      poNumber: "PO-2024-003",
      supplier: "Premium Electronics",
      amount: 52000,
      items: 98,
      status: "Delivered",
    },
    {
      poNumber: "PO-2024-004",
      supplier: "ABC Corp",
      amount: 28500,
      items: 156,
      status: "Processing",
    },
    {
      poNumber: "PO-2024-005",
      supplier: "Industrial Co",
      amount: 35000,
      items: 75,
      status: "Delivered",
    },
  ];

  // Budget Allocation by Category
  const budgetAllocation = [
    {
      category: "Electronics & IT",
      allocated: 450000,
      spent: 385000,
      remaining: 65000,
    },
    {
      category: "Raw Materials",
      allocated: 350000,
      spent: 298000,
      remaining: 52000,
    },
    {
      category: "Office Supplies",
      allocated: 150000,
      spent: 142000,
      remaining: 8000,
    },
    {
      category: "Furniture",
      allocated: 120000,
      spent: 98000,
      remaining: 22000,
    },
    { category: "Stationery", allocated: 80000, spent: 72000, remaining: 8000 },
  ];

  // Helpers
  const totalSpend = monthlySpendData.reduce(
    (sum, item) => sum + item.spend,
    0
  );
  const totalOrders = monthlySpendData.reduce(
    (sum, item) => sum + item.orders,
    0
  );
  const avgOrderValue = Math.round(totalSpend / totalOrders);
  const fmt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Custom Tooltip cho Bar Chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 rounded-lg p-3 text-white text-sm shadow-md">
          <p className="font-semibold">{payload[0].payload.supplier}</p>
          <p>Orders: {payload[0].value}</p>
          {payload[1] && <p>Value: ${fmt(payload[1].value)}</p>}
          <p>Delivery Rate: {payload[0].payload.deliveryRate}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip cho Line Chart
  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 rounded-lg p-3 text-white text-sm shadow-md">
          <p className="font-semibold">{payload[0].payload.month}</p>
          <p>Spend: ${fmt(payload[0].value)}</p>
          <p>Orders: {payload[0].payload.orders}</p>
          <p>Suppliers: {payload[0].payload.suppliers}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6 font-sans ">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-md border border-gray-100">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Purchaser Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center shadow border border-blue-100">
            <div className="text-3xl font-semibold text-blue-700">
              ${fmt(totalSpend / 1000)}K
            </div>
            <div className="text-sm text-blue-600 font-medium mt-1">
              Total Spend
            </div>
            <div className="text-xs text-blue-500 mt-2">Last 18 months</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center shadow border border-green-100">
            <div className="text-3xl font-semibold text-green-700">
              {fmt(totalOrders)}
            </div>
            <div className="text-sm text-green-600 font-medium mt-1">
              Total Orders
            </div>
            <div className="text-xs text-green-500 mt-2">Placed</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl text-center shadow border border-yellow-100">
            <div className="text-3xl font-semibold text-yellow-700">
              {purchaseData.length}
            </div>
            <div className="text-sm text-yellow-600 font-medium mt-1">
              Suppliers
            </div>
            <div className="text-xs text-yellow-500 mt-2">Active</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center shadow border border-purple-100">
            <div className="text-3xl font-semibold text-purple-700">
              ${fmt(avgOrderValue)}
            </div>
            <div className="text-sm text-purple-600 font-medium mt-1">
              Avg Order Value
            </div>
            <div className="text-xs text-purple-500 mt-2">Per order</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl text-center shadow border border-red-100">
            <div className="text-3xl font-semibold text-red-700">94.2%</div>
            <div className="text-sm text-red-600 font-medium mt-1">
              Avg Delivery
            </div>
            <div className="text-xs text-red-500 mt-2">On-time rate</div>
          </div>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="space-y-6">
        {/* 1. Supplier Performance (Full Width) */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            Supplier Performance Overview
          </h2>
          <ResponsiveContainer width="100%" height={480}>
            <BarChart
              data={purchaseData}
              margin={{ top: 16, right: 24, left: 0, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="supplier"
                stroke="#64748b"
                fontSize={12}
                angle={-30}
                textAnchor="end"
                height={60}
                tick={{ fill: "#64748b" }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tick={{ fill: "#64748b" }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="orders"
                fill="url(#ordersGradient)"
                radius={[8, 8, 0, 0]}
                name="Orders"
              />
              <Bar
                dataKey="value"
                fill="url(#valueGradient)"
                radius={[8, 8, 0, 0]}
                name="Value ($)"
              />
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Two Small Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Spend Trend */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
              Monthly Spend Trend (18 Months)
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={monthlySpendData}
                margin={{ top: 12, right: 12, left: 0, bottom: 36 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={11}
                  angle={-30}
                  textAnchor="end"
                  height={56}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line
                  type="monotone"
                  dataKey="spend"
                  stroke="url(#spendGradient)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: "#0891b2", strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient
                    id="spendGradient"
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

          {/* Category Spend Distribution */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
              Category Spend Distribution
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categorySpend}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={96}
                  innerRadius={56}
                  paddingAngle={2}
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {categorySpend.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        [
                          "#3b82f6",
                          "#10b981",
                          "#f59e0b",
                          "#8b5cf6",
                          "#ef4444",
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
          {/* Supplier Performance Metrics */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
              Top Suppliers Performance
            </h2>
            <div className="space-y-3">
              {supplierPerformance.map((supplier, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800 text-sm">
                      #{idx + 1} {supplier.name}
                    </p>
                    <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">
                      {supplier.qualityScore}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Lead: {supplier.avgLeadTime}</div>
                    <div>Savings: {supplier.costSavings}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Allocation Status */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
              Budget Allocation Status
            </h2>
            <div className="space-y-3">
              {budgetAllocation.map((cat, idx) => {
                const pct = Math.min(100, (cat.spent / cat.allocated) * 100);
                return (
                  <div key={idx} className="border-b border-gray-200 pb-3">
                    <p className="font-semibold text-gray-800 text-sm mb-2">
                      {cat.category}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>
                        ${fmt(cat.spent / 1000)}K / ${fmt(cat.allocated / 1000)}
                        K
                      </span>
                      <span className="font-semibold text-green-600">
                        ${fmt(cat.remaining / 1000)}K left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Top Purchase Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
            Recent Top Purchase Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPurchases.map((po, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-900 font-mono font-semibold">
                      {po.poNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{po.supplier}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">
                      ${fmt(po.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{po.items}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          po.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : po.status === "In Transit"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPurchaser;
