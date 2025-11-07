// src/components/Performance/PerformanceStaff.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  PackageCheck,
  Scale,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  User2,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import performanceService from "../../Services/StaffSale/performmanceService";

// Helpers
const formatCurrency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );

const formatNumber = (n) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
    Number(n || 0)
  );

const cardClass =
  "rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300";

/**
 * PerformanceStaff
 * - Gọi API getCurrentMonthPerformance()
 * - Lấy staff đầu tiên trong payload (dạng { "CODE": {...} })
 * - Hiển thị KPI + RadialBar (completionRate) + BarChart (tổng quan chỉ số)
 */
const PerformanceStaff = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null); // object của 1 staff

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await performanceService.getCurrentMonthPerformance();
      // Payload dạng: { "NV-7C4B3D": { ... } }
      const first = res ? res[Object.keys(res)[0]] : null;
      setData(first || null);
    } catch {
      setErr("Không thể tải hiệu suất tháng hiện tại.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Chuẩn hóa dữ liệu biểu đồ
  const completion = useMemo(() => {
    const v = Number(data?.completionRate ?? 0);
    return Math.max(0, Math.min(100, v));
  }, [data]);

  const barMetrics = useMemo(
    () => [
      {
        key: "totalOrders",
        name: "Đơn hàng",
        value: Number(data?.totalOrders || 0),
      },
      {
        key: "totalParcels",
        name: "Kiện hàng",
        value: Number(data?.totalParcels || 0),
      },
      {
        key: "totalNetWeight",
        name: "TL thực (kg)",
        value: Number(data?.totalNetWeight || 0),
      },
    ],
    [data]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Hiệu suất tháng hiện tại
          </h2>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Tải lại
        </button>
      </div>

      {/* Loading / Error / Empty */}
      {loading && (
        <div className={`${cardClass}`}>
          <div className="flex items-center justify-center py-12 text-blue-600">
            <RefreshCw className="h-6 w-6 animate-spin mr-3" />
            Đang tải dữ liệu...
          </div>
        </div>
      )}

      {!loading && err && (
        <div className={`${cardClass} border-red-300`}>
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <span className="text-base">{err}</span>
          </div>
        </div>
      )}

      {!loading && !err && !data && (
        <div className={`${cardClass}`}>
          <div className="text-center text-gray-600 py-12 text-base">
            Chưa có dữ liệu.
          </div>
        </div>
      )}

      {!loading && !err && data && (
        <>
          {/* Info + Completion */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Staff Info */}
            <div className={`${cardClass}`}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
                  <User2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {data.name || "—"}
                    </h3>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                      {data.department || "SALE"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Mã nhân viên:{" "}
                    <span className="font-mono">{data.staffCode}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Tổng thu hàng</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(data.totalGoods || 0)}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-600">Phí ship</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">
                    {formatCurrency(data.totalShip || 0)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-xs text-gray-600">Đơn</div>
                  <div className="mt-1 text-base font-semibold text-gray-900">
                    {formatNumber(data.totalOrders || 0)}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-xs text-gray-600">Kiện</div>
                  <div className="mt-1 text-base font-semibold text-gray-900">
                    {formatNumber(data.totalParcels || 0)}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-xs text-gray-600">TL thực (kg)</div>
                  <div className="mt-1 text-base font-semibold text-gray-900">
                    {formatNumber(data.totalNetWeight || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Rate (Radial) */}
            <div className={`${cardClass} lg:col-span-2`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tỷ lệ hoàn thành
                  </h3>
                </div>
                <span className="text-sm text-gray-500">Tháng hiện tại</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radial Chart */}
                <div className="h-44 md:h-52 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[
                        {
                          name: "Hoàn thành",
                          value: completion,
                          fill: "#6366f1",
                        },
                        {
                          name: "Còn lại",
                          value: 100 - completion,
                          fill: "#e5e7eb",
                        },
                      ]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        tick={false}
                      />
                      <RadialBar dataKey="value" cornerRadius={20} background />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-gray-900">
                      {completion}%
                    </span>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Hàng hoá (VND)</div>
                    <div className="mt-1 text-base font-semibold text-gray-900">
                      {formatCurrency(data.totalGoods || 0)}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Ship:{" "}
                      <span className="font-medium text-gray-700">
                        {formatCurrency(data.totalShip || 0)}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-lg bg-indigo-50 p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <BarChart2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm text-indigo-600">Đơn hàng</div>
                      <div className="text-base font-semibold">
                        {formatNumber(data.totalOrders || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-emerald-50 p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <PackageCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-emerald-600">Kiện</div>
                      <div className="text-base font-semibold">
                        {formatNumber(data.totalParcels || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-sm text-gray-600">Phản hồi xấu</div>
                    <div className="mt-1 text-base font-semibold text-red-600">
                      {formatNumber(data.badFeedbackCount || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart tổng quan */}
          <div className={`${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Tổng quan số liệu
                </h3>
              </div>
              <span className="text-sm text-gray-500">
                Đơn / Kiện / TL thực
              </span>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barMetrics} barCategoryGap={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tickMargin={10} fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [formatNumber(value), name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      padding: "8px 12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceStaff;
