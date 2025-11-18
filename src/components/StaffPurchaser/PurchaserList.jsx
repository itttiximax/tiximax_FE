import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  Truck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  XCircle,
  Calendar,
  User,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import CancelPurchase from "./CancelPurchase";

const PAGE_SIZE_DEFAULT = 10;

// Normalize shipment code
const normalizeShipmentCode = (code) => {
  if (!code) return "";
  if (typeof code === "string") {
    return code.replace(/^"+|"+$/g, "").trim();
  }
  return String(code).trim();
};

// Status configuration
const STATUS_CONFIG = {
  DA_MUA: {
    label: "Đã mua",
    color: "bg-green-100 text-green-800 border-green-200",
    dotColor: "bg-green-500",
  },
  DAU_GIA_THANH_CONG: {
    label: "Đấu giá thành công",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    dotColor: "bg-purple-500",
  },
  DA_NHAP_KHO_NN: {
    label: "Đã nhập kho NN",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
  },
  DA_HUY: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-200",
    dotColor: "bg-red-500",
  },
};

const filters = [
  { value: "", label: "Tất cả", icon: Package },
  { value: "DA_MUA", label: "Đã mua", icon: CheckCircle2 },
  { value: "DAU_GIA_THANH_CONG", label: "Đấu giá", icon: ShoppingCart },
  { value: "DA_NHAP_KHO_NN", label: "Nhập kho NN", icon: Truck },
  { value: "DA_HUY", label: "Đã hủy", icon: XCircle },
];

/** Skeleton card giống style list */
const CardSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="animate-pulse">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-7 w-28 rounded-lg bg-white/70 border border-blue-100" />
            <div className="h-4 w-24 rounded bg-blue-100/70" />
          </div>
          <div className="flex gap-3">
            <div className="h-3 w-20 rounded bg-blue-100/70" />
            <div className="h-3 w-28 rounded bg-blue-100/70" />
          </div>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-4 w-2/3 rounded bg-gray-100" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
      </div>
    </div>
  </div>
);

const PurchaserList = () => {
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(1); // 1-based cho UI
  const [size, setSize] = useState(PAGE_SIZE_DEFAULT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: null,
    linkId: null,
    orderCode: "",
    linkInfo: null,
  });

  const fetchData = async (
    customPage = page,
    customSize = size,
    customFilter = filter
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderlinkService.getAllPurchases(
        customPage - 1,
        customSize,
        customFilter
      );

      // Remove duplicates based on purchaseId
      const uniquePurchases = (res?.content || []).reduce((acc, current) => {
        const exists = acc.find(
          (item) => item.purchaseId === current.purchaseId
        );
        if (!exists) acc.push(current);
        return acc;
      }, []);

      setPurchases(uniquePurchases);
      setTotalPages(res?.totalPages || 1);
      setTotalElements(res?.totalElements || 0);
    } catch (e) {
      console.error(e);
      setError("Không thể tải danh sách purchase.");
      toast.error("Lỗi khi tải dữ liệu purchase.");
    } finally {
      setLoading(false);
    }
  };

  // load lại khi đổi page / filter / size
  useEffect(() => {
    fetchData(page, size, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter, size]);

  // Lọc purchases theo search term
  const filteredPurchases = useMemo(() => {
    if (!searchTerm.trim()) return purchases;

    const term = searchTerm.toLowerCase();
    return purchases.filter(
      (p) =>
        p.purchaseCode?.toLowerCase().includes(term) ||
        p.orderCode?.toLowerCase().includes(term) ||
        p.staffName?.toLowerCase().includes(term) ||
        p.pendingLinks?.some(
          (link) =>
            link.productName?.toLowerCase().includes(term) ||
            link.trackingCode?.toLowerCase().includes(term) ||
            normalizeShipmentCode(link.shipmentCode)
              .toLowerCase()
              .includes(term)
        )
    );
  }, [purchases, searchTerm]);

  // Thống kê - CHỈ check shipment code cho DA_MUA và DAU_GIA_THANH_CONG
  const stats = useMemo(() => {
    let totalLinks = 0;
    let needShipmentCode = 0;
    let hasShipmentCode = 0;
    let missingShipmentCode = 0;

    purchases.forEach((p) => {
      (p.pendingLinks || []).forEach((link) => {
        totalLinks++;

        if (link.status === "DA_MUA" || link.status === "DAU_GIA_THANH_CONG") {
          needShipmentCode++;
          const code = normalizeShipmentCode(link.shipmentCode);
          if (code) hasShipmentCode++;
          else missingShipmentCode++;
        }
      });
    });

    return {
      totalLinks,
      needShipmentCode,
      hasShipmentCode,
      missingShipmentCode,
    };
  }, [purchases]);

  const handleRefresh = () => {
    fetchData();
    toast.success("Đã làm mới dữ liệu");
  };

  const openCancelModal = (purchase, link) => {
    setCancelModal({
      open: true,
      orderId: purchase.orderId,
      linkId: link.linkId,
      orderCode: purchase.orderCode,
      linkInfo: link,
    });
  };

  const closeCancelModal = () => {
    setCancelModal((prev) => ({ ...prev, open: false }));
  };

  const handleFilterClick = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  // Kiểm tra xem link có cần shipment code không
  const needsShipmentCode = (status) => {
    return status === "DA_MUA" || status === "DAU_GIA_THANH_CONG";
  };

  return (
    <div className="min-h-screen via-white to-indigo-50 px-4 py-6 lg:px-8">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              {/* ĐÃ SỬA: div bọc ngoài, chỉ 1 thẻ h1 */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý đơn mua hàng
                </h1>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Theo dõi và kiểm tra shipment code của các đơn{" "}
                <span className="font-semibold text-blue-600">Đã mua</span> và{" "}
                <span className="font-semibold text-purple-600">
                  Đấu giá thành công
                </span>
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-all hover:shadow-md"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn, sản phẩm, tracking code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {filters.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.value}
                    onClick={() => handleFilterClick(f.value)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      filter === f.value
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-sky-300 to-blue-400 to-emerald-200 p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-900">
                  Tổng đơn
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {purchases.length}
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-300 p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-900">
                  Tổng links
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stats.totalLinks}
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3">
                <Truck className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-200 to-emerald-100 p-5 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-black-700">
                  Đã có mã vận đơn
                </p>
                <p className="mt-2 text-3xl font-bold text-black-800">
                  {stats.hasShipmentCode}
                  <span className="text-lg font-medium text-black-600">
                    /{stats.needShipmentCode}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-red-200 to-rose-100 p-5 shadow-sm border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-black-700">
                  Chưa có mã vận đơn
                </p>
                <p className="mt-2 text-3xl font-bold text-black-800">
                  {stats.missingShipmentCode}
                  <span className="text-lg font-medium text-black-600">
                    /{stats.needShipmentCode}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-gray-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading: skeleton giống list trên */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: Math.min(size, 10) }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {!error && filteredPurchases.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-sm text-gray-500">
                  {searchTerm
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Chưa có đơn mua hàng nào"}
                </p>
              </div>
            )}

            {/* Purchase List */}
            {!error && filteredPurchases.length > 0 && (
              <div className="space-y-4">
                {filteredPurchases.map((purchase) => (
                  <div
                    key={purchase.purchaseId}
                    className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Purchase Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 rounded-lg bg-white border border-blue-200 px-3 py-1.5 text-sm font-bold text-blue-900 shadow-sm">
                            <ShoppingCart className="h-4 w-4" />
                            {purchase.purchaseCode}
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">
                              {purchase.orderCode}
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span className="font-medium text-gray-900">
                              {purchase.staffName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xl text-gray-900">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {purchase.purchaseTime
                                ? new Date(
                                    purchase.purchaseTime
                                  ).toLocaleString("vi-VN", {
                                    dateStyle: "short",
                                  })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pending Links */}
                    <div className="p-6">
                      <div className="space-y-3">
                        {(purchase.pendingLinks || []).map((link, index) => {
                          const normalizedCode = normalizeShipmentCode(
                            link.shipmentCode
                          );
                          const hasCode = !!normalizedCode;
                          const statusConfig = STATUS_CONFIG[link.status] || {
                            label: link.status,
                            color: "bg-gray-100 text-gray-800 border-gray-200",
                            dotColor: "bg-gray-500",
                          };
                          const requiresShipmentCode = needsShipmentCode(
                            link.status
                          );

                          return (
                            <div
                              key={`${purchase.purchaseId}-${link.linkId}-${index}`}
                              className="group rounded-xl border border-gray-200 bg-gray-50 p-4 hover:bg-white hover:shadow-sm transition-all"
                            >
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                {/* Left: Product Info */}
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-semibold text-gray-900">
                                      {link.productName}
                                    </h4>
                                    <span
                                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig.color}`}
                                    >
                                      <span
                                        className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotColor}`}
                                      />
                                      {statusConfig.label}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xl text-black-600">
                                    {link.website && (
                                      <span>
                                        Website:{" "}
                                        <span className="font-medium text-gray-900">
                                          {link.website}
                                        </span>
                                      </span>
                                    )}
                                    <span>
                                      SL:{" "}
                                      <span className="font-medium text-gray-900">
                                        {link.quantity}
                                      </span>
                                    </span>
                                    {link.trackingCode && (
                                      <span className="flex items-center gap-1">
                                        Tracking:{" "}
                                        <span className="font-medium text-blue-600">
                                          {link.trackingCode}
                                        </span>
                                      </span>
                                    )}
                                    {link.classify && (
                                      <span>
                                        Phân loại:{" "}
                                        <span className="font-medium text-gray-900">
                                          {link.classify}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Shipment Code & Actions */}
                                <div className="flex flex-col items-start gap-3 lg:items-end">
                                  {requiresShipmentCode && (
                                    <div className="flex items-center gap-2">
                                      <Truck className="h-4 w-4 text-gray-400" />
                                      {hasCode ? (
                                        <div className="flex items-center gap-2">
                                          <span className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-mono font-semibold text-green-800">
                                            {normalizedCode}
                                          </span>
                                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Đã có mã
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700">
                                          <AlertCircle className="h-3.5 w-3.5" />
                                          Chưa có shipment code
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {link.status !== "DA_HUY" && (
                                    <button
                                      onClick={() =>
                                        openCancelModal(purchase, link)
                                      }
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                      Hủy đơn
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && filteredPurchases.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white border border-gray-200 px-6 py-4 shadow-sm">
            <div className="text-sm text-gray-600">
              Hiển thị trang{" "}
              <span className="font-semibold text-gray-900">{page}</span> /{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
              <span className="ml-2 text-gray-400">({totalElements} đơn)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>

              {/* Size selector */}
              <div className="ml-3 border-l border-gray-200 pl-3">
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal hủy đơn */}
      <CancelPurchase
        isOpen={cancelModal.open}
        onClose={closeCancelModal}
        orderId={cancelModal.orderId}
        linkId={cancelModal.linkId}
        orderCode={cancelModal.orderCode}
        linkInfo={cancelModal.linkInfo}
        onSuccess={() => {
          fetchData();
          toast.success("Đã hủy đơn thành công");
        }}
      />
    </div>
  );
};

export default PurchaserList;
