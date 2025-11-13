import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  PlaneTakeoff,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Printer,
  Download,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  BadgeCheck,
} from "lucide-react";

/**
 * OrderHistory.jsx — Tiximax
 * - Tone vàng – trắng – đen
 * - Filter trạng thái, tìm kiếm mã đơn, sắp xếp ngày/tổng tiền
 * - Bảng (desktop) + thẻ (mobile)
 * - Drawer xem nhanh chi tiết đơn
 * - Phân trang client-side + mock data (thay bằng API thật dễ dàng)
 */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STATUS = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  INTRANSIT: "Đang vận chuyển",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const statusMeta = {
  [STATUS.PENDING]: {
    class: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  [STATUS.PROCESSING]: {
    class: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: RefreshCw,
  },
  [STATUS.INTRANSIT]: {
    class: "bg-blue-50 text-blue-700 border-blue-200",
    icon: PlaneTakeoff,
  },
  [STATUS.DELIVERED]: {
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  [STATUS.CANCELLED]: {
    class: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const formatCurrency = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

const mockOrders = [
  {
    code: "DH001",
    date: "2025-10-01T10:21:00Z",
    total: 1250000,
    status: STATUS.DELIVERED,
    items: [
      { name: "Máy ảnh Fuji X100V", qty: 1, price: 950000 },
      { name: "Phí vận chuyển JP → VN", qty: 1, price: 300000 },
    ],
    route: "JP → VN",
    address: "Hà Nội",
  },
  {
    code: "DH002",
    date: "2025-10-12T08:00:00Z",
    total: 3550000,
    status: STATUS.INTRANSIT,
    items: [
      { name: "Giày sneaker NB 990", qty: 2, price: 3100000 },
      { name: "Phí bảo hiểm", qty: 1, price: 450000 },
    ],
    route: "US → VN",
    address: "Đà Nẵng",
  },
  {
    code: "DH003",
    date: "2025-09-25T14:42:00Z",
    total: 890000,
    status: STATUS.PROCESSING,
    items: [
      { name: "Bộ Lego #75305", qty: 1, price: 760000 },
      { name: "Phí đóng gói/pallet", qty: 1, price: 130000 },
    ],
    route: "JP → VN",
    address: "TP.HCM",
  },
  {
    code: "DH004",
    date: "2025-09-10T16:10:00Z",
    total: 480000,
    status: STATUS.CANCELLED,
    items: [{ name: "Tai nghe KZ", qty: 1, price: 480000 }],
    route: "KR → VN",
    address: "Hải Phòng",
  },
  {
    code: "DH005",
    date: "2025-10-20T11:05:00Z",
    total: 2190000,
    status: STATUS.PENDING,
    items: [
      { name: "Mô hình Figure", qty: 1, price: 1990000 },
      { name: "Phí xử lý inbound", qty: 1, price: 200000 },
    ],
    route: "JP → VN",
    address: "Nghệ An",
  },
];

const OrderHistory = () => {
  // In thực tế: thay mockOrders bằng dữ liệu lấy từ API theo user
  const [orders, setOrders] = useState(mockOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc | date_asc | total_desc | total_asc
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const pageSize = 5;

  const tabs = [
    { key: "ALL", label: "Tất cả" },
    { key: STATUS.PENDING, label: "Chờ xử lý" },
    { key: STATUS.PROCESSING, label: "Đang xử lý" },
    { key: STATUS.INTRANSIT, label: "Đang vận chuyển" },
    { key: STATUS.DELIVERED, label: "Đã giao" },
    { key: STATUS.CANCELLED, label: "Đã hủy" },
  ];

  const filtered = useMemo(() => {
    let data = [...orders];

    // Tìm kiếm theo mã đơn
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      data = data.filter((o) => o.code.toLowerCase().includes(q));
    }

    // Lọc trạng thái
    if (statusFilter !== "ALL") {
      data = data.filter((o) => o.status === statusFilter);
    }

    // Sắp xếp
    data.sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "total_desc") return b.total - a.total;
      if (sortBy === "total_asc") return a.total - b.total;
      return 0;
    });

    return data;
  }, [orders, query, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const StatusBadge = ({ s }) => {
    const m = statusMeta[s] || {};
    const Icon = m.icon || Clock;
    return (
      <span
        className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-xs font-semibold ${m.class}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {s}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-300 via-yellow-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-6 lg:pt-20 lg:pb-10">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              <Package className="w-3.5 h-3.5" /> Lịch sử đơn hàng
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-black text-gray-900">
              Đơn hàng của bạn — theo dõi minh bạch, cập nhật theo thời gian
              thực
            </h1>
            <p className="mt-2 text-gray-600">
              Tra cứu mã đơn, trạng thái, tuyến vận chuyển và chi tiết chi phí.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Tìm mã đơn (VD: DH001)"
                    className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
                  >
                    {tabs.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option value="date_desc">Mới nhất</option>
                    <option value="date_asc">Cũ nhất</option>
                    <option value="total_desc">Tổng tiền ↓</option>
                    <option value="total_asc">Tổng tiền ↑</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                  onClick={() => window.print()}
                  title="In (demo)"
                >
                  <Printer className="w-4 h-4" /> In
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                  onClick={() => alert("Export CSV (demo)")}
                  title="Xuất CSV (demo)"
                >
                  <Download className="w-4 h-4" /> Xuất CSV
                </button>
              </div>
            </div>

            {/* Mobile quick filters */}
            <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
              >
                {tabs.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="date_desc">Mới nhất</option>
                <option value="date_asc">Cũ nhất</option>
                <option value="total_desc">Tổng tiền ↓</option>
                <option value="total_asc">Tổng tiền ↑</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center"
            >
              <BadgeCheck className="w-10 h-10 text-amber-600 mx-auto" />
              <p className="mt-3 font-semibold text-gray-900">
                Không tìm thấy đơn phù hợp
              </p>
              <p className="text-sm text-gray-600">
                Hãy thử đổi mã đơn, trạng thái hoặc sắp xếp khác.
              </p>
            </motion.div>
          )}

          {/* Table (desktop) */}
          {filtered.length > 0 && (
            <>
              <div className="hidden md:block mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-amber-50/60">
                    <tr className="text-left text-gray-700">
                      <th className="px-4 py-3 font-semibold">Mã đơn</th>
                      <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                      <th className="px-4 py-3 font-semibold">Tuyến</th>
                      <th className="px-4 py-3 font-semibold">Địa chỉ</th>
                      <th className="px-4 py-3 font-semibold">Trạng thái</th>
                      <th className="px-4 py-3 font-semibold text-right">
                        Tổng tiền
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((o) => (
                      <tr key={o.code} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {o.code}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(o.date).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{o.route}</td>
                        <td className="px-4 py-3 text-gray-700">{o.address}</td>
                        <td className="px-4 py-3">
                          <StatusBadge s={o.status} />
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          {formatCurrency(o.total)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDetail(o)}
                            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                          >
                            <Eye className="w-4 h-4" /> Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards (mobile) */}
              <div className="md:hidden mt-6 grid gap-3">
                {paged.map((o) => (
                  <div
                    key={o.code}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {o.code}
                          </span>
                          <StatusBadge s={o.status} />
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {new Date(o.date).toLocaleString("vi-VN")}
                        </div>
                      </div>
                      <div className="text-right font-extrabold text-gray-900">
                        {formatCurrency(o.total)}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-amber-50 px-3 py-2">
                        <p className="text-xs text-gray-600">Tuyến</p>
                        <p className="font-semibold text-gray-900">{o.route}</p>
                      </div>
                      <div className="rounded-xl bg-amber-50 px-3 py-2">
                        <p className="text-xs text-gray-600">Giao đến</p>
                        <p className="font-semibold text-gray-900">
                          {o.address}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => setDetail(o)}
                        className="inline-flex items-center gap-1 rounded-xl px-3 py-2 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                      >
                        <Eye className="w-4 h-4" /> Xem chi tiết
                      </button>
                      <button className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
                        Theo dõi <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Hiển thị{" "}
                  <span className="font-semibold">
                    {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, filtered.length)}
                  </span>{" "}
                  / {filtered.length} đơn
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <div className="px-2">
                    Trang <span className="font-semibold">{page}</span>/
                    {totalPages}
                  </div>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-xl border border-gray-200 px-3 py-1.5 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Detail Drawer */}
      <AnimatePresence>
        {detail && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50"
          >
            <div className="h-full flex flex-col">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold bg-amber-100 text-amber-700 inline-flex items-center gap-1 px-2 py-0.5 rounded-full">
                    <Package className="w-3.5 h-3.5" /> {detail.code}
                  </div>
                  <div className="mt-1 text-lg font-bold text-gray-900">
                    Chi tiết đơn hàng
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(detail.date).toLocaleString("vi-VN")}
                  </div>
                </div>
                <button
                  onClick={() => setDetail(null)}
                  className="rounded-xl border border-gray-200 px-2.5 py-1.5 text-sm hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>

              <div className="p-5 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="text-xs text-gray-600">Trạng thái</p>
                    <div className="mt-1">
                      <StatusBadge s={detail.status} />
                    </div>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="text-xs text-gray-600">Tuyến</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {detail.route}
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="text-xs text-gray-600">Giao đến</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {detail.address}
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="text-xs text-gray-600">Tổng tiền</p>
                    <p className="mt-1 font-extrabold text-gray-900">
                      {formatCurrency(detail.total)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-amber-50/50 font-semibold">
                    Sản phẩm / Phí dịch vụ
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {detail.items.map((it, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 grid place-items-center rounded-lg bg-gray-100 text-gray-700">
                            <Package className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="font-medium text-gray-900">
                              {it.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              SL: {it.qty}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(it.price)}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-3 border-t border-gray-100 text-right text-sm">
                    <span className="text-gray-600 mr-2">Tổng cộng:</span>
                    <span className="font-extrabold text-gray-900">
                      {formatCurrency(detail.total)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => alert("In hóa đơn (demo)")}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                  >
                    <Printer className="w-4 h-4" /> In hóa đơn
                  </button>
                  <button
                    onClick={() => alert("Tải PDF (demo)")}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                  >
                    <Download className="w-4 h-4" /> Tải PDF
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </main>
  );
};

export default OrderHistory;
