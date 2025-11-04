// UpdateShipmentCodeList.jsx — Pro UI refactor
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
} from "lucide-react";
import UpdateShipmentCode from "./UpdateShipmentCode";
import toast from "react-hot-toast";

const PAGE_SIZE_DEFAULT = 10;

/** Utility chips */
const Chip = ({ color = "slate", children, className = "" }) => {
  const map = {
    red: "bg-red-50 text-red-700 border-red-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${map[color]} ${className}`}
    >
      {children}
    </span>
  );
};

/** Skeleton loader */
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Debounce search term for smoother UX
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Date formatter memo
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
          s /*, debouncedQ if backend supports */
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
    // reset về trang 0 khi đổi size / search
    setPage(0);
  }, [size, debouncedQ]);

  useEffect(() => {
    fetchData(page, size);
  }, [page, size, fetchData]);

  const allOnPage = Array.isArray(data?.content) ? data.content : [];

  const items = useMemo(() => {
    const list = allOnPage;
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
  }, [allOnPage, debouncedQ]);

  // Pagination flags (prefer server meta if available)
  const hasPrev = data?.first === false || page > 0;
  const hasNext =
    data?.last === false || (items.length === size && !debouncedQ);

  const missingCount = allOnPage.filter(
    (x) => !(x.shipmentCode || x.purchaseCode || x.trackingCode)
  ).length;

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã copy tracking");
    } catch {
      toast.error("Copy không thành công");
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

  // Small helpers
  const hasShipment = (p) =>
    Boolean(p?.shipmentCode || p?.purchaseCode || p?.trackingCode);

  // Order Type pretty label
  const typeLabel = (t) =>
    ({
      MUA_HO: "Mua hộ",
      KY_GUI: "Ký gửi",
      DAU_GIA: "Đấu giá",
    }[t] ||
    t ||
    "-");

  return (
    <div className="min-h-screen ">
      {/* <Toaster position="top-right" /> */}

      <div className="mx-auto  px-6 py-8">
        {/* Title Bar */}
        <div className="sticky top-0 z-10 -mx-6 mb-6 border-b bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
                <Barcode className="h-5 w-5 text-indigo-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Thiếu mã vận đơn
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <Chip color="red">
                    <AlertTriangle className="h-4 w-4" /> {missingCount} đơn
                    thiếu mã
                  </Chip>
                  <Chip color="blue">Trang {page + 1}</Chip>
                  {debouncedQ && (
                    <Chip color="amber">Đang lọc: "{debouncedQ}"</Chip>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm Order, Staff, Tracking, Website…"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm outline-none ring-indigo-500/0 transition focus:ring-2"
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
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
                  showFilters
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter className="h-4 w-4" /> Bộ lọc
              </button>
            </div>
          </div>

          {/* Filters row (placeholders for future) */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm">
                <span className="shrink-0 text-slate-500">Loại đơn:</span>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Tất cả</option>
                  <option>Mua hộ</option>
                  <option>Ký gửi</option>
                  <option>Đấu giá</option>
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm">
                <span className="shrink-0 text-slate-500">Khoảng ngày:</span>
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-sm">
                <span className="shrink-0 text-slate-500">Staff:</span>
                <input
                  placeholder="Tên nhân viên"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {err && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-3 rounded-full bg-indigo-50 p-3">
              <Search className="h-5 w-5 text-indigo-600" />
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
                fetchData(0, size);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4" /> Tải lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {items.map((p) => {
              const missing = !hasShipment(p);
              const links = Array.isArray(p.pendingLinks) ? p.pendingLinks : [];
              return (
                <div
                  key={p.purchaseId}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-mono text-lg font-semibold text-indigo-700">
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
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
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
                                <span className="font-mono text-indigo-700">
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

        {/* Pagination */}
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
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        )}

        {/* Modal Component */}
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
