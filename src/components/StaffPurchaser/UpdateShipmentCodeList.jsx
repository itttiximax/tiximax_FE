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
  X,
  Filter,
  Clock,
  Globe,
  Truck,
} from "lucide-react";
import UpdateShipmentCode from "./UpdateShipmentCode";
import UpdateAuctionShip from "./UpdateAuctionShip";
import toast from "react-hot-toast";

const PAGE_SIZE_DEFAULT = 10;

const StatusBadge = ({ status, count }) => {
  if (status === "missing") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 border border-red-100">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-sm font-medium text-red-700">
          {count} đơn chưa có mã
        </span>
      </div>
    );
  }
  if (status === "completed") {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-100">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-sm font-medium text-emerald-700">
          {count} đơn đã có mã
        </span>
      </div>
    );
  }
  return null;
};

const CardSkeleton = () => (
  <div className="rounded-lg border border-slate-200 bg-white">
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-5 w-40 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-100" />
      <div className="space-y-3">
        <div className="h-20 rounded bg-slate-50" />
        <div className="h-20 rounded bg-slate-50" />
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
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState("all");
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [debouncedQ, setDebouncedQ] = useState(q);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
      }),
    []
  );
  const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : "-");

  const fetchData = useCallback(
    async (p = page, s = size) => {
      setLoading(true);
      setErr(null);
      try {
        const statusParam =
          purchaseStatusFilter === "all" ? null : purchaseStatusFilter;
        const res = await orderlinkService.getPurchasesShipmentCode(
          p,
          s,
          statusParam
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
    [page, size, purchaseStatusFilter]
  );

  useEffect(() => {
    setPage(0);
  }, [size, debouncedQ, purchaseStatusFilter, shipmentStatusFilter]);

  useEffect(() => {
    fetchData(page, size);
  }, [page, size, fetchData]);

  const allOnPage = Array.isArray(data?.content) ? data.content : [];

  const hasShipment = (p) => {
    const links = Array.isArray(p.pendingLinks) ? p.pendingLinks : [];
    if (links.length === 0) return false;
    return links.every(
      (l) => l.shipmentCode && l.shipmentCode.toString().trim() !== ""
    );
  };

  // Helper function để lấy status từ links
  const getPurchaseStatus = (p) => {
    const links = Array.isArray(p.pendingLinks) ? p.pendingLinks : [];
    if (links.length === 0) return null;
    // Lấy status từ link đầu tiên (giả sử tất cả links có cùng status)
    return links[0]?.status || null;
  };

  const items = useMemo(() => {
    let list = allOnPage;

    if (shipmentStatusFilter === "missing") {
      list = list.filter((p) => !hasShipment(p));
    } else if (shipmentStatusFilter === "has") {
      list = list.filter((p) => hasShipment(p));
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
  }, [allOnPage, debouncedQ, shipmentStatusFilter]);

  const hasPrev = data?.first === false || page > 0;
  const hasNext =
    data?.last === false || (items.length === size && !debouncedQ);

  const missingCountOnPage = allOnPage.filter((p) => !hasShipment(p)).length;
  const completedCountOnPage = allOnPage.filter((p) => hasShipment(p)).length;

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

  const openAuctionModal = (purchase) => {
    setSelectedPurchase(purchase);
    setShowAuctionModal(true);
  };

  const closeAuctionModal = () => {
    setShowAuctionModal(false);
    setSelectedPurchase(null);
  };

  const handleSaveSuccess = () => {
    fetchData();
  };

  const purchaseStatusLabel = (status) => {
    const labels = {
      DA_MUA: "Đã mua",
      DAU_GIA_THANH_CONG: "Đấu giá thành công",
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Barcode className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Quản lý mã vận đơn
            </h1>
          </div>

          {/* Search & Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm kiếm theo mã đơn, nhân viên, tracking..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {q && (
                  <button
                    onClick={() => setQ("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                {/* Purchase Status Filter */}
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <select
                    value={purchaseStatusFilter}
                    onChange={(e) => setPurchaseStatusFilter(e.target.value)}
                    className="border-none bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="DA_MUA">Đã mua</option>
                    <option value="DAU_GIA_THANH_CONG">
                      Đấu giá thành công
                    </option>
                  </select>
                </div>

                {/* Shipment Status Filter */}
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                  <Package className="h-4 w-4 text-slate-500" />
                  <select
                    value={shipmentStatusFilter}
                    onChange={(e) => setShipmentStatusFilter(e.target.value)}
                    className="border-none bg-transparent text-sm font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="all">Tất cả</option>
                    <option value="missing">Chưa có mã</option>
                    <option value="has">Đã có mã</option>
                  </select>
                </div>

                <button
                  onClick={() => fetchData(page, size)}
                  disabled={loading}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  title="Làm mới"
                >
                  <RefreshCw
                    className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Status Info */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {missingCountOnPage > 0 && (
                  <StatusBadge status="missing" count={missingCountOnPage} />
                )}
                {completedCountOnPage > 0 && (
                  <StatusBadge
                    status="completed"
                    count={completedCountOnPage}
                  />
                )}
              </div>
              {debouncedQ && (
                <div className="text-sm text-slate-600">
                  Tìm thấy <span className="font-medium">{items.length}</span>{" "}
                  kết quả
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {err && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{err}</p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-16">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mb-2 text-base font-medium text-slate-900">
              Không tìm thấy kết quả
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={() => {
                setQ("");
                setPurchaseStatusFilter("all");
                setShipmentStatusFilter("all");
                fetchData(0, size);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" /> Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                const isCompleted = hasShipment(p);
                const status = getPurchaseStatus(p);
                const isAuction = status === "DAU_GIA_THANH_CONG";
                const links = Array.isArray(p.pendingLinks)
                  ? p.pendingLinks
                  : [];

                return (
                  <div
                    key={p.purchaseId}
                    className="flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden"
                  >
                    {/* Card Header */}
                    <div
                      className={`border-b px-5 py-4 ${
                        isCompleted
                          ? "bg-emerald-300 border-emerald-300"
                          : "bg-rose-300 border-rose-300"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 font-mono text-lg font-semibold text-slate-900">
                            {p.orderCode}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="inline-flex items-center gap-1 text-slate-700">
                              <Clock className="h-4 w-4" />
                              {formatDate(p.purchaseTime)}
                            </span>
                          </div>
                        </div>
                        {isCompleted ? (
                          <div className="flex h-8 items-center rounded-md bg-emerald-50 px-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="flex h-8 items-center rounded-md bg-red-50 px-2.5">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {status && (
                            <span
                              className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                                isAuction
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {purchaseStatusLabel(status)}
                            </span>
                          )}
                        </div>
                        {!isCompleted &&
                          (isAuction ? (
                            <button
                              onClick={() => openAuctionModal(p)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
                            >
                              <Truck className="h-3.5 w-3.5" />
                              Cập nhật vận chuyển
                            </button>
                          ) : (
                            <button
                              onClick={() => openShipmentModal(p)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                            >
                              <Package className="h-3.5 w-3.5" />
                              Nhập mã vận đơn
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex-1 p-5">
                      {links.length === 0 ? (
                        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 p-6 text-center">
                          <p className="text-sm text-slate-500">
                            Không có link chờ xử lý
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {links.map((l) => (
                            <div
                              key={l.linkId}
                              className="rounded-lg border border-slate-300 bg-slate-50 p-4"
                            >
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
                                  {l.productName}
                                </h4>
                                {l.trackingCode && (
                                  <button
                                    onClick={() => copy(l.trackingCode)}
                                    className="flex-shrink-0 rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
                                    title="Copy tracking"
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="space-y-1.5 text-xs text-slate-600">
                                <div className="flex items-center gap-1.5">
                                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                                  <span>{l.website}</span>
                                  <span className="text-slate-400">-</span>
                                  <span>SL: {l.quantity}</span>
                                </div>

                                {l.classify && (
                                  <div className="text-xs text-slate-600">
                                    Phân loại: {l.classify}
                                  </div>
                                )}

                                <div className="flex items-start gap-1.5">
                                  <span className="text-slate-500">
                                    Tracking:
                                  </span>
                                  <span className="flex-1 font-mono text-xs">
                                    {l.trackingCode || "-"}
                                  </span>
                                </div>

                                <div className="flex items-start gap-1.5">
                                  <span className="text-slate-500">
                                    Mã vận đơn:
                                  </span>
                                  <span
                                    className={`flex-1 font-mono text-xs ${
                                      l.shipmentCode?.trim()
                                        ? "text-blue-700 font-medium"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {l.shipmentCode?.trim() || "Chưa có"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div className="text-sm text-slate-600">
                Hiển thị <span className="font-medium">{items.length}</span> kết
                quả
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(0)}
                  disabled={!hasPrev || loading}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  title="Trang đầu"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={!hasPrev || loading}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  title="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="mx-2 flex h-8 min-w-[80px] items-center justify-center rounded-md bg-slate-50 px-3 text-sm font-medium text-slate-700">
                  Trang {page + 1}
                </div>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext || loading}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  title="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    if (data?.totalPages) setPage(data.totalPages - 1);
                  }}
                  disabled={!hasNext || !data?.totalPages}
                  className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
                  title="Trang cuối"
                >
                  <ChevronsRight className="h-5 w-5" />
                </button>

                <div className="ml-2 border-l border-slate-200 pl-2">
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
                    <option value={50}>50 / trang</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modals */}
        <UpdateShipmentCode
          isOpen={showModal}
          onClose={closeShipmentModal}
          purchase={selectedPurchase}
          onSaveSuccess={handleSaveSuccess}
        />

        <UpdateAuctionShip
          isOpen={showAuctionModal}
          onClose={closeAuctionModal}
          purchase={selectedPurchase}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    </div>
  );
};

export default UpdateShipmentCodeList;
