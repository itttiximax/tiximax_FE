// src/Components/DashboardSale.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { DateRange } from "react-date-range";
import { addYears, isAfter, isBefore, endOfDay, startOfDay } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import saleService from "../../Services/Dashboard/saleService";

/* ---------------------- Helpers ---------------------- */
const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const fmtVN = (d) =>
  d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatCurrency = (num) =>
  (Number(num) || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const formatNum = (n) => (Number.isFinite(n) ? n.toLocaleString("vi-VN") : "—");

/* ---------------------- Component ---------------------- */
const DashboardSale = () => {
  // Giới hạn chọn tối đa: trong vòng 1 năm tính đến hôm nay
  const maxDate = endOfDay(new Date());
  const minDate = startOfDay(addYears(new Date(), -1));

  // Date range picker state
  const [selectionRange, setSelectionRange] = useState({
    startDate: startOfDay(addYears(new Date(), -0)), // mặc định: hôm nay về đầu ngày
    endDate: endOfDay(new Date()),
    key: "selection",
  });
  const [openPicker, setOpenPicker] = useState(false);

  // API state
  const [perf, setPerf] = useState({ loading: false, error: "", row: null });

  // Chuẩn hóa và clamp range theo min/max 1 năm
  const { startDateClamped, endDateClamped, rangeLabel, startYMD, endYMD } =
    useMemo(() => {
      let s = selectionRange.startDate
        ? startOfDay(selectionRange.startDate)
        : minDate;
      let e = selectionRange.endDate
        ? endOfDay(selectionRange.endDate)
        : maxDate;

      // Clamp vào [minDate, maxDate]
      if (isBefore(s, minDate)) s = minDate;
      if (isAfter(e, maxDate)) e = maxDate;
      if (isAfter(s, e)) s = e; // đảm bảo s <= e

      return {
        startDateClamped: s,
        endDateClamped: e,
        startYMD: toYMD(s),
        endYMD: toYMD(e),
        rangeLabel: `Khoảng thời gian: ${fmtVN(s)} - ${fmtVN(e)}`,
      };
    }, [selectionRange, minDate, maxDate]);

  // Gọi API mỗi khi range thay đổi
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setPerf((s) => ({ ...s, loading: true, error: "" }));
        const data = await saleService.getMyPerformance(startYMD, endYMD);
        const firstKey = data ? Object.keys(data)[0] : null;
        const row = firstKey ? data[firstKey] : null;
        if (!ignore) setPerf({ loading: false, error: "", row });
      } catch (e) {
        if (!ignore)
          setPerf({
            loading: false,
            error: e?.message || "Không lấy được hiệu suất.",
            row: null,
          });
      }
    })();
    return () => {
      ignore = true;
    };
  }, [startYMD, endYMD]);

  // Nút preset nhanh
  const presets = [
    {
      label: "Hôm nay",
      getRange: () => {
        const t0 = startOfDay(new Date());
        const t1 = endOfDay(new Date());
        return { startDate: t0, endDate: t1 };
      },
    },
    {
      label: "7 ngày qua",
      getRange: () => {
        const t1 = endOfDay(new Date());
        const t0 = startOfDay(addYears(new Date(), 0)); // tạm dùng ngày hiện tại rồi trừ ngày
        const t0_7 = new Date(t0);
        t0_7.setDate(t0.getDate() - 6);
        return { startDate: t0_7, endDate: t1 };
      },
    },
    {
      label: "30 ngày qua",
      getRange: () => {
        const t1 = endOfDay(new Date());
        const t0 = startOfDay(new Date());
        const t0_30 = new Date(t0);
        t0_30.setDate(t0.getDate() - 29);
        return { startDate: t0_30, endDate: t1 };
      },
    },
    {
      label: "Toàn bộ 1 năm",
      getRange: () => ({ startDate: minDate, endDate: maxDate }),
    },
  ];

  // Khi user chọn trên date picker
  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setSelectionRange({
      startDate: startDate || selectionRange.startDate,
      endDate: endDate || selectionRange.endDate,
      key: "selection",
    });
  };

  // Chuẩn hóa số liệu từ API
  const row = perf.row || {
    totalGoods: 0,
    totalShip: 0,
    totalOrders: 0,
    totalParcels: 0,
    completionRate: 0, // (%)
    totalNetWeight: 0,
    badFeedbackCount: 0,
    newCustomersInPeriod: 0,
    name: "",
    staffCode: "",
  };

  // Dữ liệu biểu đồ (aggregate comparisons)
  const chartValueVsShip = [
    { name: "Giá trị hàng", value: row.totalGoods || 0 },
    { name: "Phí ship", value: row.totalShip || 0 },
  ];
  const chartOrdersVsParcels = [
    { name: "Đơn hàng", value: row.totalOrders || 0 },
    { name: "Kiện hàng", value: row.totalParcels || 0 },
  ];
  const completion = Math.max(
    0,
    Math.min(100, Number(row.completionRate || 0))
  );
  const chartCompletion = [
    { name: "Hoàn tất", value: completion },
    { name: "Còn lại", value: Math.max(0, 100 - completion) },
  ];
  const chartWeight = [
    { name: "Khối lượng (kg)", value: row.totalNetWeight || 0 },
  ];

  return (
    <section className="py-12 px-6 lg:px-12">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Dashboard Bán Hàng
              </h2>
              <p className="text-gray-600 mt-1">{rangeLabel}</p>
              {row.staffCode && (
                <p className="text-sm text-gray-500">
                  Nhân sự:{" "}
                  <span className="font-medium">
                    {row.name || row.staffCode}
                  </span>
                </p>
              )}
              {perf.error && (
                <p className="text-sm text-red-600 mt-1">⚠️ {perf.error}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Nút preset nhanh */}
              <div className="hidden md:flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() =>
                      setSelectionRange({ ...p.getRange(), key: "selection" })
                    }
                    className="px-3 py-2 rounded-full bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 text-sm font-semibold"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Nút bật/tắt DateRange */}
              <button
                onClick={() => setOpenPicker((v) => !v)}
                className="px-4 py-2 rounded-full bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300"
                title="Chọn khoảng ngày"
              >
                Chọn ngày
              </button>
            </div>

            {/* Loading overlay mượt */}
            {perf.loading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-6 w-6 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 text-sm font-medium">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DateRange Picker */}
          {openPicker && (
            <div className="bg-white rounded-xl shadow p-3 border border-gray-100">
              <DateRange
                ranges={[selectionRange]}
                onChange={handleSelect}
                showSelectionPreview
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
                maxDate={maxDate}
                minDate={minDate}
                rangeColors={["#facc15"]}
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => setOpenPicker(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-sm text-gray-500 mb-2 font-semibold">
              Tổng doanh thu
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(row.totalGoods)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-sm text-gray-500 mb-2 font-semibold">
              Tổng đơn hàng
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNum(row.totalOrders)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-sm text-gray-500 mb-2 font-semibold">
              Tổng kiện hàng
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNum(row.totalParcels)}
            </p>
          </div>
        </div>

        {/* Charts: So sánh aggregate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Giá trị hàng vs Phí ship */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Giá trị hàng vs Phí ship
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartValueVsShip}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(v) => `${Math.round(v / 1_000_000)}tr`}
                />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="value" fill="#facc15" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 text-sm text-gray-600">
              Doanh thu: <b>{formatCurrency(row.totalGoods)}</b> • Phí ship:{" "}
              <b>{formatCurrency(row.totalShip)}</b>
            </div>
          </div>

          {/* Số đơn vs Số kiện */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Số đơn vs Số kiện
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartOrdersVsParcels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#fde68a"
                  stroke="#facc15"
                  strokeWidth={2}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 text-sm text-gray-600">
              Đơn: <b>{formatNum(row.totalOrders)}</b> • Kiện:{" "}
              <b>{formatNum(row.totalParcels)}</b>
            </div>
          </div>
        </div>

        {/* Completion Rate gauge + Net Weight */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Tỉ lệ hoàn tất
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer>
                <RadialBarChart
                  data={chartCompletion}
                  innerRadius="55%"
                  outerRadius="95%"
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" cornerRadius={10} fill="#facc15" />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                  <Tooltip formatter={(v) => `${v}%`} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Hoàn tất: <b>{completion.toFixed(2)}%</b> • Còn lại:{" "}
              <b>{(100 - completion).toFixed(2)}%</b>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Khối lượng tịnh (kg)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartWeight}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#fde68a"
                  stroke="#facc15"
                  strokeWidth={2}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 text-sm text-gray-600">
              Tổng: <b>{formatNum(row.totalNetWeight)} kg</b>
            </div>
          </div>
        </div>

        {/* Không có data */}
        {!perf.loading && !perf.error && !perf.row && (
          <p className="text-center text-gray-500 mt-8">
            Không có dữ liệu trong khoảng thời gian đã chọn.
          </p>
        )}
      </div>
    </section>
  );
};

export default DashboardSale;
