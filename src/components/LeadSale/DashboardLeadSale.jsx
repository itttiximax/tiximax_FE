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
  const COMPACT = true;

  // ===== Data =====
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
  const statIcons = [Target, TrendingUp, DollarSign, Award];

  const leadsBySource = [
    { source: "Website", leads: 420, value: 45000 },
    { source: "Facebook", leads: 380, value: 32000 },
    { source: "Email", leads: 250, value: 18000 },
    { source: "LinkedIn", leads: 120, value: 15000 },
    { source: "Referral", leads: 75, value: 8000 },
  ];

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

  const conversionByStage = [
    { name: "New Lead", value: 45, color: "#3b82f6" },
    { name: "Qualified", value: 30, color: "#10b981" },
    { name: "Proposal", value: 15, color: "#f59e0b" },
    { name: "Negotiation", value: 7, color: "#ef4444" },
    { name: "Closed Won", value: 3, color: "#8b5cf6" },
  ];

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

  const topPerformers = [
    { name: "Nguyễn Văn A", deals: 42, revenue: 125000, conversion: 32 },
    { name: "Trần Thị B", deals: 38, revenue: 118000, conversion: 29 },
    { name: "Lê Văn C", deals: 35, revenue: 95000, conversion: 28 },
    { name: "Phạm Thị D", deals: 31, revenue: 89000, conversion: 25 },
  ];

  // ===== Compact sizes =====
  const chartHBig = COMPACT ? 240 : 350;
  const chartHPie = COMPACT ? 220 : 320;
  const chartHLine = COMPACT ? 220 : 300;
  const tickSize = COMPACT ? 10 : 12;
  const titleText = COMPACT ? "text-xl" : "text-2xl";
  const headerH1 = COMPACT ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl";
  const cardPad = COMPACT ? "p-4" : "p-6";
  const outerPad = COMPACT ? "p-4 sm:p-5 lg:p-6" : "p-4 sm:p-6 lg:p-8";
  const rounder = COMPACT ? "rounded-2xl" : "rounded-3xl";
  const gapMain = COMPACT ? "gap-4" : "gap-6";

  // ===== Tooltips (compact) =====
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-gray-700 p-2 rounded-md text-[11px]">
          <p className="text-white font-semibold mb-1">
            {payload[0].payload.source}
          </p>
          <p className="text-blue-300">
            Leads: <b>{payload[0].value}</b>
          </p>
          <p className="text-emerald-300">
            Revenue: <b>${payload[1]?.value?.toLocaleString()}</b>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 border border-gray-700 p-2 rounded-md text-[11px]">
          <p className="text-white font-semibold mb-1">
            {payload[0].payload.month} 2024
          </p>
          <p className="text-cyan-300">
            Leads: <b>{payload[0].value}</b>
          </p>
          <p className="text-emerald-300">
            Revenue: <b>${payload[1].value.toLocaleString()}</b>
          </p>
        </div>
      );
    }
    return null;
  };

  const activityIcons = {
    deal: DollarSign,
    lead: Target,
    qualified: CheckCircle,
    proposal: FileText,
    followup: PhoneCall,
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 p-4 ${outerPad} font-sans`}
    >
      <div className="max-w-[1600px] mx-auto space-y-5">
        {/* Header */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 ${rounder} ${cardPad} sm:p-6 shadow-2xl`}
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className={`${headerH1} font-black text-white mb-1`}>
                  Lead Sale Dashboard
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Tổng quan hiệu suất bán hàng • Cập nhật realtime
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl">
                <span className="text-white text-xs font-medium">
                  Tháng 10, 2024
                </span>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${gapMain}`}
            >
              {stats.map((stat, index) => {
                const Icon = statIcons[index] || Target;
                return (
                  <div
                    key={index}
                    className={`group relative bg-white/95 backdrop-blur-xl ${rounder} ${cardPad} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-[2px] border border-white/50`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 ${rounder} transition-opacity duration-300`}
                    />
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-6 h-6 text-gray-700" />
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            {stat.title}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-2">
                          {stat.value}
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
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

        {/* Main Charts */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapMain}`}>
          {/* Leads by Source */}
          <div
            className={`lg:col-span-2 bg-white/95 backdrop-blur-xl ${rounder} ${cardPad} sm:p-6 shadow-xl border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`${titleText} font-bold text-gray-900 flex items-center gap-2`}
              >
                <BarChart2 className="w-5 h-5" /> Leads by Source
              </h2>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <span className="text-gray-600">Leads</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <span className="text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={chartHBig}>
              <BarChart data={leadsBySource} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="source"
                  stroke="#6b7280"
                  fontSize={tickSize}
                  tick={{ fill: "#374151" }}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={tickSize}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="leads"
                  fill="url(#leadsGradient)"
                  radius={[6, 6, 0, 0]}
                  name="Leads"
                />
                <Bar
                  dataKey="value"
                  fill="url(#revenueGradient)"
                  radius={[6, 6, 0, 0]}
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

          {/* Conversion Funnel */}
          <div
            className={`bg-white/95 backdrop-blur-xl ${rounder} ${cardPad} shadow-xl border border-gray-100`}
          >
            <h2 className={`${titleText} font-bold text-gray-900 mb-4`}>
              Conversion Funnel
            </h2>
            <ResponsiveContainer width="100%" height={chartHPie}>
              <PieChart>
                <Pie
                  data={conversionByStage}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={COMPACT ? 86 : 100}
                  innerRadius={COMPACT ? 48 : 60}
                  paddingAngle={2}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
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
                    padding: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {conversionByStage.map((stage, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-[11px] text-gray-700 font-medium">
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-900">
                    {stage.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div
          className={`bg-white/95 backdrop-blur-xl ${rounder} ${cardPad} sm:p-6 shadow-xl border border-gray-100`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${titleText} font-bold text-gray-900`}>
              Monthly Performance
            </h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-gray-600">Leads</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={chartHLine}>
            <LineChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={tickSize}
                tick={{ fill: "#374151" }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={tickSize}
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#06b6d4", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom: Activities & Top Performers */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${gapMain}`}>
          {/* Recent Activities */}
          <div
            className={`bg-white/95 backdrop-blur-xl ${rounder} ${cardPad} shadow-xl border border-gray-100`}
          >
            <h2 className={`${titleText} font-bold text-gray-900 mb-4`}>
              Recent Activities
            </h2>
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1.5">
              {recentActivities.map((activity) => {
                const Icon = activityIcons[activity.type] || Target;
                return (
                  <div
                    key={activity.id}
                    className={`group flex items-center gap-3 p-3 ${rounder} transition-all duration-300 hover:shadow cursor-pointer
                      ${
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
                      className={`flex-shrink-0 w-10 h-10 ${rounder} flex items-center justify-center
                        ${
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
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-500">
                          {activity.source}
                        </span>
                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-[11px] text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[13px] font-bold text-gray-900">
                        {activity.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performers */}
          <div
            className={`bg-white/95 backdrop-blur-xl ${rounder} ${cardPad} shadow-xl border border-gray-100`}
          >
            <h2 className={`${titleText} font-bold text-gray-900 mb-4`}>
              Top Performers
            </h2>
            <div className="space-y-3">
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
                    className={`group relative flex items-center gap-3 p-3 ${rounder} bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:shadow`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                          ${
                            index === 0
                              ? "bg-gradient-to-br from-amber-400 to-orange-500"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-300 to-gray-400"
                              : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-amber-700"
                              : "bg-gradient-to-br from-indigo-500 to-purple-500"
                          }`}
                      >
                        <AvatarIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-gray-900">
                        {performer.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-gray-600">
                          {performer.deals} deals
                        </span>
                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-[11px] text-gray-600">
                          {performer.conversion}% rate
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-emerald-600">
                        ${(performer.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* defs gradients for Bar (fallback for non-inline defs) */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default DashboardLeadSale;
