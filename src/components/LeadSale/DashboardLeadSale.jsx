import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LineChart, Line } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

// lucide icons
import {
  Target,
  TrendingUp,
  DollarSign,
  Award,
  BarChart2,
  CheckCircle,
  FileText,
  PhoneCall,
  Star,
  Zap,
  User,
} from "lucide-react";

const DashboardLeadSale = () => {
  // Enhanced Fake Data (removed emoji icons)
  const stats = [
    {
      title: "Tổng Leads",
      value: "1,245",
      change: "+15%",
      positive: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Tỷ lệ Chuyển đổi",
      value: "28.5%",
      change: "+3.2%",
      positive: true,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Doanh thu Tháng",
      value: "$89,750",
      change: "+22%",
      positive: true,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Deals Đóng",
      value: "156",
      change: "+8",
      positive: true,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  // map icons for stats (index-based)
  const statIcons = [Target, TrendingUp, DollarSign, Award];

  // Enhanced Leads by Source
  const leadsBySource = [
    { source: "Website", leads: 420, value: 45000 },
    { source: "Facebook", leads: 380, value: 32000 },
    { source: "Email", leads: 250, value: 18000 },
    { source: "LinkedIn", leads: 120, value: 15000 },
    { source: "Referral", leads: 75, value: 8000 },
  ];

  // Monthly Performance
  const monthlyPerformance = [
    { month: "Jan", leads: 80, revenue: 4500, deals: 12 },
    { month: "Feb", leads: 95, revenue: 5200, deals: 15 },
    { month: "Mar", leads: 120, revenue: 6800, deals: 18 },
    { month: "Apr", leads: 140, revenue: 7500, deals: 21 },
    { month: "May", leads: 160, revenue: 8900, deals: 24 },
    { month: "Jun", leads: 180, revenue: 10200, deals: 28 },
    { month: "Jul", leads: 200, revenue: 11800, deals: 32 },
    { month: "Aug", leads: 220, revenue: 12500, deals: 35 },
    { month: "Sep", leads: 240, revenue: 14200, deals: 38 },
    { month: "Oct", leads: 260, revenue: 15800, deals: 42 },
    { month: "Nov", leads: 280, revenue: 17500, deals: 45 },
    { month: "Dec", leads: 300, revenue: 19200, deals: 48 },
  ];

  // Conversion Funnel
  const conversionByStage = [
    { name: "New Lead", value: 45, color: "#3b82f6" },
    { name: "Qualified", value: 30, color: "#10b981" },
    { name: "Proposal", value: 15, color: "#f59e0b" },
    { name: "Negotiation", value: 7, color: "#ef4444" },
    { name: "Closed Won", value: 3, color: "#8b5cf6" },
  ];

  // Recent Activities with enhanced data (no emoji)
  const recentActivities = [
    {
      id: 1,
      action: "New Lead: Công ty ABC",
      source: "Website",
      time: "5 phút trước",
      type: "lead",
      value: "$2,500",
    },
    {
      id: 2,
      action: "Deal Closed: Startup Tech",
      source: "Facebook",
      time: "15 phút trước",
      type: "deal",
      value: "$12,500",
    },
    {
      id: 3,
      action: "Qualified Lead: XYZ Corp",
      source: "LinkedIn",
      time: "45 phút trước",
      type: "qualified",
      value: "$8,000",
    },
    {
      id: 4,
      action: "Proposal Sent: DEF Solutions",
      source: "Email",
      time: "2 giờ trước",
      type: "proposal",
      value: "$15,000",
    },
    {
      id: 5,
      action: "Follow-up: GHI Industries",
      source: "Referral",
      time: "3 giờ trước",
      type: "followup",
      value: "$5,500",
    },
  ];

  // Top Performers
  const topPerformers = [
    { name: "Nguyễn Văn A", deals: 42, revenue: 125000, conversion: 32 },
    { name: "Trần Thị B", deals: 38, revenue: 118000, conversion: 29 },
    { name: "Lê Văn C", deals: 35, revenue: 95000, conversion: 28 },
    { name: "Phạm Thị D", deals: 31, revenue: 89000, conversion: 25 },
  ];

  // Enhanced Tooltips
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95  border-gray-700 p-3 rounded-md">
          <p className="text-white font-semibold text-sm mb-2">
            {payload[0].payload.source}
          </p>
          <div className="space-y-1">
            <p className="text-blue-400 text-xs">
              Leads: <span className="font-bold">{payload[0].value}</span>
            </p>
            <p className="text-emerald-400 text-xs">
              Revenue:{" "}
              <span className="font-bold">
                ${payload[1]?.value?.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-gray-700 p-3 rounded-md">
          <p className="text-white font-semibold text-sm mb-2">
            {payload[0].payload.month} 2024
          </p>
          <div className="space-y-1">
            <p className="text-cyan-400 text-xs">
              Leads: <span className="font-bold">{payload[0].value}</span>
            </p>
            <p className="text-emerald-400 text-xs">
              Revenue:{" "}
              <span className="font-bold">
                ${payload[1].value.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Activity type -> lucide icon mapping
  const activityIcons = {
    deal: DollarSign,
    lead: Target,
    qualified: CheckCircle,
    proposal: FileText,
    followup: PhoneCall,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 0 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 rounded-3xl p-8 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                  Lead Sale Dashboard
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Tổng quan hiệu suất bán hàng • Cập nhật realtime
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl">
                <span className="text-white text-sm font-medium">
                  Tháng 10, 2024
                </span>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = statIcons[index] || Target;
                return (
                  <div
                    key={index}
                    className="group relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                    ></div>

                    <div className="relative flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span>
                            <Icon className="w-8 h-8 text-gray-700" />
                          </span>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {stat.title}
                          </span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-2">
                          {stat.value}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            stat.positive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span>{stat.positive ? "↗" : "↘"}</span>
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads by Source - Full Width on Mobile, 2 cols on Desktop */}
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart2 className="w-6 h-6" />
                Leads by Source
              </h2>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <span className="text-gray-600">Leads</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={leadsBySource} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="source"
                  stroke="#6b7280"
                  fontSize={13}
                  fontWeight={600}
                  tick={{ fill: "#374151" }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="leads"
                  fill="url(#leadsGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Leads"
                />
                <Bar
                  dataKey="value"
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]}
                  name="Revenue ($)"
                />
                <defs>
                  <linearGradient
                    id="leadsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Funnel - Pie Chart */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              Conversion Funnel
            </h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={conversionByStage}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {conversionByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    border: "1px solid rgba(75, 85, 99, 0.3)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {conversionByStage.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    ></div>
                    <span className="text-xs text-gray-700 font-medium">
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    {stage.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Monthly Performance
            </h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-gray-600">Leads</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: "#374151" }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: "#06b6d4", strokeWidth: 3 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Section: Activities & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">📋</span>
              Recent Activities
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {recentActivities.map((activity) => {
                const Icon =
                  activityIcons[activity.type] !== undefined
                    ? activityIcons[activity.type]
                    : Target;
                return (
                  <div
                    key={activity.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer ${
                      activity.type === "deal"
                        ? "bg-emerald-50 hover:bg-emerald-100"
                        : activity.type === "lead"
                        ? "bg-blue-50 hover:bg-blue-100"
                        : activity.type === "qualified"
                        ? "bg-amber-50 hover:bg-amber-100"
                        : activity.type === "proposal"
                        ? "bg-purple-50 hover:bg-purple-100"
                        : "bg-cyan-50 hover:bg-cyan-100"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        activity.type === "deal"
                          ? "bg-emerald-200"
                          : activity.type === "lead"
                          ? "bg-blue-200"
                          : activity.type === "qualified"
                          ? "bg-amber-200"
                          : activity.type === "proposal"
                          ? "bg-purple-200"
                          : "bg-cyan-200"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.source}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {activity.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              Top Performers
            </h2>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => {
                const AvatarIcon =
                  index === 0
                    ? Award
                    : index === 1
                    ? Star
                    : index === 2
                    ? Zap
                    : User;
                return (
                  <div
                    key={index}
                    className="group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                          index === 0
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-400"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-600 to-amber-700"
                            : "bg-gradient-to-br from-indigo-500 to-purple-500"
                        }`}
                      >
                        <AvatarIcon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {performer.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600">
                          {performer.deals} deals
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          {performer.conversion}% rate
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        ${(performer.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLeadSale;
