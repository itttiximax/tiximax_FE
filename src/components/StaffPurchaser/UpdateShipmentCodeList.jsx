// UpdateShipmentCodeList.jsx — Enhanced Pro UI with Tailwind CSS (Blue & White Theme)
import React, { useCallback, useEffect, useMemo, useState } from "react";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import {
  RefreshCw,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Copy,
  Search,
  AlertTriangle,
  CheckCircle2,
  Barcode,
  Package,
  Loader2,
  Filter,
  X,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import UpdateShipmentCode from "./UpdateShipmentCode";
import toast from "react-hot-toast";

const PAGE_SIZE_DEFAULT = 10;

/** Enhanced Chip with hover effects */
const Chip = ({ color = "slate", children, className = "" }) => {
  const map = {
    red: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    green:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    slate: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
    indigo:
      "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    violet:
      "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${map[color]} ${className}`}
    >
      {children}
    </span>
  );
};

/** Improved Skeleton with more detailed pulse animation */
const CardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="p-5 animate-pulse">
      <div className="h-5 w-40 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-80 rounded bg-slate-100" />
      <div className="mt-4 grid gap-2">
        <div className="h-10 rounded bg-slate-100" />
        <div className="h-10 rounded bg-slate-100" />
      </div>
    </div>
  </div>
);

const UpdateShipmentCodeList = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZE_DEFAULT);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [data, setData] = useState(null);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterStaff, setFilterStaff] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Debounce search term
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Date formatter
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        hour12: false,
        dateStyle: "short",
        timeStyle: "medium",
      }),
    []
  );
  const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : "-");

  const fetchData = useCallback(
    async (p = page, s = size) => {
      setLoading(true);
      setErr(null);
      try {
        const res = await orderlinkService.getPurchasesLackShipmentCode(
          p,
          s /* Add more params if backend supports filters/search */
        );
        setData(res);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Lỗi tải dữ liệu";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    },
    [page, size]
  );

  useEffect(() => {
    setPage(0);
  }, [size, debouncedQ, filterType, filterDateFrom, filterStaff]);

  useEffect(() => {
    fetchData(page, size);
  }, [page, size, fetchData]);

  const allOnPage = Array.isArray(data?.content) ? data.content : [];

  const items = useMemo(() => {
    let list = allOnPage;

    // Client-side filters (enhance with more logic)
    if (filterType !== "all") {
      list = list.filter((it) => it.orderType === filterType);
    }
    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom);
      list = list.filter((it) => new Date(it.purchaseTime) >= fromDate);
    }
    if (filterStaff.trim()) {
      const s = filterStaff.trim().toLowerCase();
      list = list.filter((it) => it.staffName?.toLowerCase().includes(s));
    }

    const s = debouncedQ.trim().toLowerCase();
    if (!s) return list;
    return list.filter((it) => {
      const inOrder =
        it.orderCode?.toLowerCase().includes(s) ||
        it.staffName?.toLowerCase().includes(s);
      const inLinks = (it.pendingLinks || []).some((l) => {
        const lc = String(l.linkId).toLowerCase();
        return (
          lc.includes(s) ||
          l.productName?.toLowerCase().includes(s) ||
          l.trackingCode?.toLowerCase().includes(s) ||
          l.website?.toLowerCase().includes(s)
        );
      });
      return inOrder || inLinks;
    });
  }, [allOnPage, debouncedQ, filterType, filterDateFrom, filterStaff]);

  const hasPrev = data?.first === false || page > 0;
  const hasNext =
    data?.last === false || (items.length === size && !debouncedQ);

  const missingCount = items.filter(
    (x) => !(x.shipmentCode || x.purchaseCode || x.trackingCode)
  ).length;

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã copy tracking", { position: "top-right" });
    } catch {
      toast.error("Copy không thành công", { position: "top-right" });
    }
  };

  const openShipmentModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  const closeShipmentModal = () => {
    setShowModal(false);
    setSelectedPurchase(null);
  };

  const handleSaveSuccess = () => {
    fetchData();
  };

  const hasShipment = (p) =>
    Boolean(p?.shipmentCode || p?.purchaseCode || p?.trackingCode);

  const typeLabel = (t) =>
    ({
      MUA_HO: "Mua hộ",
      KY_GUI: "Ký gửi",
      DAU_GIA: "Đấu giá",
    }[t] ||
    t ||
    "-");

  return (
    <div className="min-h-screen bg-white">
      {/* <Toaster position="top-right" /> Uncomment if needed */}

      <div className="mx-auto  px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Sticky Title Bar with shadow */}
        <div className="sticky top-0 z-10 -mx-6 mb-6 border-b bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Barcode className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Thêm mã vận đơn
                </h1>
              </div>
            </div>

            <div className="flex w-full gap-3 md:w-auto">
              <div className="flex items-center gap-2 text-sm">
                <Chip color="red">
                  <AlertTriangle className="h-4 w-4" /> {missingCount} đơn thiếu
                  mã
                </Chip>
                {debouncedQ && (
                  <Chip color="amber">Đang lọc: "{debouncedQ}"</Chip>
                )}
              </div>
              <div className="relative flex-1 md:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm Order, Staff, Tracking, Website…"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500"
                />
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => fetchData(page, size)}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </button>

              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  showFilters
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter className="h-4 w-4" /> Bộ lọc
              </button>
            </div>
          </div>

          {/* Enhanced Filters with icons */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm">
                <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả loại đơn</option>
                  <option value="MUA_HO">Mua hộ</option>
                  <option value="KY_GUI">Ký gửi</option>
                  <option value="DAU_GIA">Đấu giá</option>
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm">
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                <input
                  value={filterStaff}
                  onChange={(e) => setFilterStaff(e.target.value)}
                  placeholder="Tên nhân viên"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message with icon */}
        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {err}
          </div>
        )}

        {/* List with transition */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-3 rounded-full bg-blue-50 p-3">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Không có dữ liệu phù hợp
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Hãy thử từ khóa khác hoặc xóa bộ lọc để xem thêm kết quả.
            </p>
            <button
              onClick={() => {
                setQ("");
                setFilterType("all");
                setFilterDateFrom("");
                setFilterStaff("");
                fetchData(0, size);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" /> Tải lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const missing = !hasShipment(p);
              const links = Array.isArray(p.pendingLinks) ? p.pendingLinks : [];
              return (
                <div
                  key={p.purchaseId}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-white to-blue-50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-mono text-lg font-semibold text-blue-700">
                            {p.orderCode}
                          </span>
                          {missing ? (
                            <Chip color="red">
                              <AlertTriangle className="h-4 w-4" /> Chưa có mã
                              vận đơn
                            </Chip>
                          ) : (
                            <Chip color="green">
                              <CheckCircle2 className="h-4 w-4" /> Đã có mã vận
                              đơn
                            </Chip>
                          )}
                          <Chip color="violet">{typeLabel(p.orderType)}</Chip>
                        </div>
                        <div className="mt-1 truncate text-sm text-slate-500">
                          PurchaseID: {p.purchaseId} •{" "}
                          {formatDate(p.purchaseTime)} • {p.staffName || "-"}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {missing ? (
                          <button
                            onClick={() => openShipmentModal(p)}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            <Package className="h-4 w-4" /> Nhập mã vận đơn
                          </button>
                        ) : (
                          <div className="text-right">
                            <div className="text-xs font-medium text-emerald-700">
                              Đã cập nhật
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {links.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        Không có link chờ gán tracking.
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {links.map((l) => (
                          <div
                            key={l.linkId}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-slate-900">
                                {l.productName}
                              </div>
                              <div className="mt-0.5 truncate text-xs text-slate-600">
                                {l.website} • SL: {l.quantity} •{" "}
                                <span className="font-mono text-blue-700">
                                  {l.trackingCode || "-"}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                l.trackingCode && copy(l.trackingCode)
                              }
                              disabled={!l.trackingCode}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                              <Copy className="h-3.5 w-3.5" /> Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Pagination with more responsive layout */}
        {!loading && items.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row">
            <div className="text-sm text-slate-600">
              Hiển thị {items.length} kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(0)}
                disabled={!hasPrev || loading}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Trang đầu"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={!hasPrev || loading}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext || loading}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Trang sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (data?.totalPages) setPage(data.totalPages - 1);
                }}
                disabled={!hasNext || !data?.totalPages}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Trang cuối"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        )}

        {/* Modal */}
        <UpdateShipmentCode
          isOpen={showModal}
          onClose={closeShipmentModal}
          purchase={selectedPurchase}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    </div>
  );
};

export default UpdateShipmentCodeList;
