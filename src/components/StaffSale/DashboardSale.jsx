import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------------- Utils thời gian ---------------------- */
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfWeek = (d) => {
  // Tuần bắt đầu vào THỨ HAI (phù hợp VN)
  const day = d.getDay(); // 0=CN ... 6=Th7
  const diff = day === 0 ? -6 : 1 - day; // về thứ 2
  return startOfDay(addDays(d, diff));
};
const addWeeks = (d, n) => addDays(d, 7 * n);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

const fmtVN = (d) =>
  d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/* ---------------------- Fake data 365 ngày ---------------------- */
const generateFakeSalesData = () => {
  const regions = ["Japan", "Korea", "Indonesia", "USA", "Vietnam"];
  const channels = ["Mua hộ", "Ký gửi", "Đấu giá"];
  const data = [];

  // tạo dữ liệu từ 365 ngày trước tới hôm nay
  for (let offset = 365; offset >= 0; offset--) {
    const day = addDays(new Date(), -offset);
    const transactions = Math.floor(Math.random() * 6) + 1; // 1-6 đơn/ngày
    for (let t = 0; t < transactions; t++) {
      const date = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        Math.floor(Math.random() * 24), // giờ ngẫu nhiên
        Math.floor(Math.random() * 60)
      );
      const region = regions[Math.floor(Math.random() * regions.length)];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      data.push({
        id: data.length + 1,
        date,
        region,
        channel,
        customer: `Khách ${Math.floor(Math.random() * 800) + 100}`,
        total: Math.floor(Math.random() * 8_000_000) + 500_000, // 0.5–8tr
        parcels: Math.floor(Math.random() * 5) + 1,
      });
    }
  }
  return data;
};
const fakeSalesData = generateFakeSalesData();

const formatCurrency = (num) =>
  num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

/* ---------------------- Component chính ---------------------- */
const DashboardSale = () => {
  // granularity: day | week | month | 4weeks
  const [mode, setMode] = useState("week");

  // mốc tham chiếu: luôn là "ngày nằm trong khoảng đang xem"
  // dùng để tính start/end range tùy theo mode
  const [anchor, setAnchor] = useState(startOfDay(new Date()));

  // Tính khoảng thời gian đang xem theo mode + anchor
  const { rangeStart, rangeEnd, rangeLabel } = useMemo(() => {
    let start,
      end,
      label = "";

    if (mode === "day") {
      start = startOfDay(anchor);
      end = addDays(start, 1);
      label = `Ngày ${fmtVN(start)}`;
    } else if (mode === "week") {
      start = startOfWeek(anchor);
      end = addWeeks(start, 1);
      label = `Tuần ${fmtVN(start)} - ${fmtVN(addDays(end, -1))}`;
    } else if (mode === "month") {
      start = startOfMonth(anchor);
      end = addMonths(start, 1);
      const month = start.getMonth() + 1;
      label = `Tháng ${month}/${start.getFullYear()}`;
    } else {
      // 4weeks: cửa sổ 4 tuần bắt đầu từ tuần chứa anchor
      const wk = startOfWeek(anchor);
      start = addWeeks(wk, -3); // 4 tuần: -3, -2, -1, 0 (đến wk+1)
      end = addWeeks(wk, 1);
      label = `4 tuần: ${fmtVN(start)} - ${fmtVN(addDays(end, -1))}`;
    }

    // không cho vượt quá "hôm nay + 1 ngày"
    const todayEnd = addDays(startOfDay(new Date()), 1);
    if (end > todayEnd) end = todayEnd;

    return { rangeStart: start, rangeEnd: end, rangeLabel: label };
  }, [mode, anchor]);

  // Dữ liệu trong khoảng
  const filteredData = useMemo(() => {
    return fakeSalesData.filter(
      (x) => x.date >= rangeStart && x.date < rangeEnd
    );
  }, [rangeStart, rangeEnd]);

  // Tổng hợp
  const summary = useMemo(() => {
    const totalRevenue = filteredData.reduce((s, i) => s + i.total, 0);
    const totalOrders = filteredData.length;
    const totalParcels = filteredData.reduce((s, i) => s + i.parcels, 0);
    return { totalRevenue, totalOrders, totalParcels };
  }, [filteredData]);

  // Dữ liệu biểu đồ theo mode:
  // - day: theo giờ
  // - week & month: theo ngày
  // - 4weeks: gộp theo tuần
  const chartData = useMemo(() => {
    if (mode === "day") {
      const buckets = Array.from({ length: 24 }, (_, h) => ({
        label: `${h}:00`,
        revenue: 0,
      }));
      filteredData.forEach((x) => {
        const h = x.date.getHours();
        buckets[h].revenue += x.total;
      });
      return buckets;
    }

    if (mode === "4weeks") {
      // chia 4 tuần: [start, start+7), [..+7), [..+7), [..+7)
      const weeks = [];
      for (let i = 0; i < 4; i++) {
        const ws = addWeeks(rangeEnd, i - 4); // hoặc addWeeks(rangeStart, i);
        const we = addWeeks(ws, 1);
        const label = `W${i + 1}`;
        const revenue = filteredData
          .filter((x) => x.date >= ws && x.date < we)
          .reduce((s, i) => s + i.total, 0);
        weeks.push({ label, revenue });
      }
      return weeks;
    }

    // week & month: theo ngày
    const days = {};
    // khởi tạo trục ngày liên tục để không bị "đứt"
    for (let d = new Date(rangeStart); d < rangeEnd; d = addDays(d, 1)) {
      days[fmtVN(d)] = 0;
    }
    filteredData.forEach((x) => {
      const key = fmtVN(x.date);
      days[key] += x.total;
    });
    return Object.keys(days).map((k) => ({ label: k, revenue: days[k] }));
  }, [filteredData, mode, rangeStart, rangeEnd]);

  // Điều hướng thời gian: prev / today / next theo mode
  const goPrev = () => {
    if (mode === "day") setAnchor(addDays(anchor, -1));
    else if (mode === "week") setAnchor(addWeeks(anchor, -1));
    else if (mode === "month") setAnchor(addMonths(anchor, -1));
    else setAnchor(addWeeks(anchor, -4)); // 4weeks
  };
  const goNext = () => {
    const today = startOfDay(new Date());
    const nextAnchor =
      mode === "day"
        ? addDays(anchor, 1)
        : mode === "week"
        ? addWeeks(anchor, 1)
        : mode === "month"
        ? addMonths(anchor, 1)
        : addWeeks(anchor, 4);

    // chặn đi quá hôm nay (để range không vượt tương lai)
    if (startOfDay(nextAnchor) > today) return;
    setAnchor(nextAnchor);
  };
  const goToday = () => setAnchor(startOfDay(new Date()));

  // đổi mode thì quay về mốc hôm nay cho trực quan
  const changeMode = (m) => {
    setMode(m);
    setAnchor(startOfDay(new Date()));
  };

  return (
    <section className="bg-gray-50 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header + Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Dashboard Bán Hàng
            </h2>
            <p className="text-gray-600 mt-1">{rangeLabel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mode buttons */}
            {[
              { key: "day", label: "Ngày" },
              { key: "week", label: "Tuần" },
              { key: "month", label: "Tháng" },
              { key: "4weeks", label: "4 Tuần" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => changeMode(btn.key)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition ${
                  mode === btn.key
                    ? "bg-yellow-400 text-gray-900 shadow"
                    : "bg-white border border-gray-300 hover:border-yellow-400 text-gray-700"
                }`}
              >
                {btn.label}
              </button>
            ))}

            {/* Prev / Today / Next */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={goPrev}
                className="px-3 py-2 rounded-full bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 font-bold"
                title="Trước"
              >
                ←
              </button>
              <button
                onClick={goToday}
                className="px-4 py-2 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-800"
                title="Về hôm nay"
              >
                Hôm nay
              </button>
              <button
                onClick={goNext}
                className="px-3 py-2 rounded-full bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 font-bold"
                title="Sau"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-sm text-gray-500 mb-2 font-semibold">
              Tổng doanh thu
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-sm text-gray-500 mb-2 font-semibold">
              Tổng đơn hàng
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalOrders}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-400">
            <h3 className="text-sm text-gray-500 mb-2 font-semibold">
              Tổng kiện hàng
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalParcels}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {mode === "day"
              ? "Doanh thu theo giờ"
              : mode === "4weeks"
              ? "Doanh thu theo tuần"
              : "Doanh thu theo ngày"}
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1_000_000)}tr`} />
              <Tooltip
                formatter={(v) => formatCurrency(v)}
                labelFormatter={(l) => `📅 ${l}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#facc15"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead>
              <tr className="border-b text-gray-900 font-semibold">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Thời điểm</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Kênh</th>
                <th className="py-3 px-4">Tuyến</th>
                <th className="py-3 px-4 text-right">Doanh thu</th>
                <th className="py-3 px-4 text-center">Số kiện</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4 font-medium">{item.id}</td>
                  <td className="py-2 px-4">
                    {item.date.toLocaleString("vi-VN")}
                  </td>
                  <td className="py-2 px-4">{item.customer}</td>
                  <td className="py-2 px-4">{item.channel}</td>
                  <td className="py-2 px-4">{item.region}</td>
                  <td className="py-2 px-4 text-right font-semibold text-gray-900">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="py-2 px-4 text-center">{item.parcels}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Không có dữ liệu trong khoảng thời gian này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Dữ liệu giả lập đến ngày {new Date().toLocaleDateString("vi-VN")}
        </p>
      </div>
    </section>
  );
};

export default DashboardSale;
