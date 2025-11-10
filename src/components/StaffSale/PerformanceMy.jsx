import React, { useEffect, useMemo, useState } from "react";
import saleService from "../../Services/Dashboard/saleService"; // file bạn vừa tạo
import {
  Loader2,
  Users,
  PackageCheck,
  Package,
  Percent,
  ThumbsDown,
  Weight,
  Receipt,
} from "lucide-react";

// --- helpers ---
const formatVND = (n) =>
  typeof n === "number"
    ? n.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      })
    : "—";

const formatNum = (n) => (Number.isFinite(n) ? n.toLocaleString("vi-VN") : "—");
const formatPct = (n) =>
  Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : "0%";

const kpiItems = (row) => [
  { label: "Tổng đơn", value: formatNum(row.totalOrders), icon: Receipt },
  {
    label: "Giá trị hàng",
    value: formatVND(row.totalGoods),
    icon: PackageCheck,
  },
  { label: "Số kiện", value: formatNum(row.totalParcels), icon: Package },
  {
    label: "Tỉ lệ hoàn tất",
    value: formatPct(row.completionRate),
    icon: Percent,
  },
  {
    label: "Phản hồi xấu",
    value: formatNum(row.badFeedbackCount),
    icon: ThumbsDown,
  },
  {
    label: "Khối lượng tịnh (kg)",
    value: formatNum(row.totalNetWeight),
    icon: Weight,
  },
  {
    label: "KH mới",
    value: formatNum(row.newCustomersInPeriod ?? 0),
    icon: Users,
  },
];

const emptyRow = {
  staffCode: "—",
  name: "—",
  department: "—",
  totalOrders: 0,
  totalGoods: 0,
  totalShip: 0,
  totalParcels: 0,
  completionRate: 0,
  badFeedbackCount: 0,
  totalNetWeight: 0,
  newCustomersInPeriod: 0,
};

const toRows = (data) => {
  if (!data || typeof data !== "object") return [];
  return Object.keys(data).map((k) => ({ ...emptyRow, ...data[k] }));
};

/**
 * Props:
 *  - startDate, endDate: 'YYYY-MM-DD' | Date | number
 *  - className: optional
 */
export default function PerformanceMy({ startDate, endDate, className = "" }) {
  const [state, setState] = useState({ loading: true, error: "", rows: [] });

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      setState((s) => ({ ...s, loading: true, error: "" }));
      try {
        const data = await saleService.getMyPerformance(startDate, endDate);
        const rows = toRows(data);
        if (!ignore) setState({ loading: false, error: "", rows });
      } catch (e) {
        if (!ignore)
          setState({
            loading: false,
            error: e?.message || "Lỗi tải dữ liệu",
            rows: [],
          });
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [startDate, endDate]);

  const summary = useMemo(() => {
    if (!state.rows.length) return emptyRow;
    return state.rows.reduce(
      (acc, r) => ({
        ...acc,
        totalOrders: acc.totalOrders + (r.totalOrders || 0),
        totalGoods: acc.totalGoods + (r.totalGoods || 0),
        totalShip: acc.totalShip + (r.totalShip || 0),
        totalParcels: acc.totalParcels + (r.totalParcels || 0),
        // completionRate tổng hợp: weighted theo số đơn (nếu không có đơn thì giữ 0)
        completionRate:
          acc.totalOrders + r.totalOrders > 0
            ? (acc.completionRate * acc.totalOrders +
                (r.completionRate || 0) * (r.totalOrders || 0)) /
              (acc.totalOrders + (r.totalOrders || 0))
            : 0,
        badFeedbackCount: acc.badFeedbackCount + (r.badFeedbackCount || 0),
        totalNetWeight: acc.totalNetWeight + (r.totalNetWeight || 0),
        newCustomersInPeriod:
          acc.newCustomersInPeriod + (r.newCustomersInPeriod || 0),
      }),
      { ...emptyRow }
    );
  }, [state.rows]);

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold">Hiệu suất cá nhân</h2>
          <p className="text-sm text-gray-500">
            Khoảng thời gian:{" "}
            <span className="font-medium">
              {String(startDate)} → {String(endDate)}
            </span>
          </p>
        </div>
        {state.loading && (
          <div className="inline-flex items-center text-sm text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải…
          </div>
        )}
      </div>

      {/* Error */}
      {state.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {state.error}
        </div>
      )}

      {/* KPI cards (từ tổng) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpiItems(summary).map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow transition"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-yellow-50 p-2">
                <k.icon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{k.label}</div>
                <div className="text-base font-semibold">{k.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bảng chi tiết theo staff (nếu nhiều key) */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr className="text-xs uppercase text-gray-500">
              <th className="px-4 py-3 text-left">Mã NV</th>
              <th className="px-4 py-3 text-left">Tên</th>
              <th className="px-4 py-3 text-left">Phòng ban</th>
              <th className="px-4 py-3 text-right">Tổng đơn</th>
              <th className="px-4 py-3 text-right">Giá trị hàng</th>
              <th className="px-4 py-3 text-right">Số kiện</th>
              <th className="px-4 py-3 text-right">Tỉ lệ hoàn tất</th>
              <th className="px-4 py-3 text-right">Phản hồi xấu</th>
              <th className="px-4 py-3 text-right">Khối lượng (kg)</th>
              <th className="px-4 py-3 text-right">KH mới</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {state.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Không có dữ liệu trong khoảng thời gian này.
                </td>
              </tr>
            ) : (
              state.rows.map((r) => (
                <tr key={r.staffCode} className="hover:bg-yellow-50/40">
                  <td className="px-4 py-3 font-medium">{r.staffCode}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.department}</td>
                  <td className="px-4 py-3 text-right">
                    {formatNum(r.totalOrders)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatVND(r.totalGoods)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNum(r.totalParcels)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatPct(r.completionRate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNum(r.badFeedbackCount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNum(r.totalNetWeight)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatNum(r.newCustomersInPeriod ?? 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
