import React, { useEffect, useMemo, useState } from "react";
import {
  Package,
  Truck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import CancelPurchase from "./CancelPurchase";
// Chuẩn hóa shipmentCode (loại bỏ dấu " dư thừa, trim khoảng trắng)
const normalizeShipmentCode = (code) => {
  if (!code) return "";
  if (typeof code === "string") {
    // Xóa các dấu " ở đầu/cuối và trim
    return code.replace(/^"+|"+$/g, "").trim();
  }
  return String(code).trim();
};
const PurchaserList = () => {
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(1); // Backend: /purchases/all-purchase/1/10 → 1-based
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State cho modal hủy đơn
  const [cancelModal, setCancelModal] = useState({
    open: false,
    orderId: null,
    linkId: null,
    orderCode: "",
    linkInfo: null,
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderlinkService.getAllPurchases(page, size);
      // res dự kiến dạng: { content, totalPages, totalElements, ... }
      setPurchases(res?.content || []);
      setTotalPages(res?.totalPages || 1);
    } catch (e) {
      console.error(e);
      setError("Không thể tải danh sách purchase.");
      toast.error("Lỗi khi tải dữ liệu purchase.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  // Thống kê tổng link đã có / chưa có shipment code
  const stats = useMemo(() => {
    let withCode = 0;
    let withoutCode = 0;
    purchases.forEach((p) => {
      (p.pendingLinks || []).forEach((link) => {
        const code = normalizeShipmentCode(link.shipmentCode);
        if (code) withCode += 1;
        else withoutCode += 1;
      });
    });
    return { withCode, withoutCode };
  }, [purchases]);
  const handleRefresh = () => {
    fetchData();
  };
  // Mở modal hủy đơn
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-gray-900">
              <Package className="h-6 w-6 text-amber-600" />
              Danh sách Purchase (Pending Links)
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Kiểm tra nhanh{" "}
              <span className="font-medium text-gray-800">shipment code</span>{" "}
              của từng link xem đã có hay chưa.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>
        </div>
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase text-gray-500">
              Tổng purchase
            </p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              {purchases.length}
            </p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Link đã có shipment code
            </p>
            <p className="mt-1 text-2xl font-extrabold text-green-800">
              {stats.withCode}
            </p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase text-red-700">
              <AlertCircle className="h-4 w-4" />
              Link chưa có shipment code
            </p>
            <p className="mt-1 text-2xl font-extrabold text-red-800">
              {stats.withoutCode}
            </p>
          </div>
        </div>
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}
        {/* Empty */}
        {!loading && !error && purchases.length === 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600 shadow-sm">
            Chưa có purchase nào.
          </div>
        )}
        {/* List */}
        {!loading && purchases.length > 0 && (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div
                key={purchase.purchaseId}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                {/* Purchase header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
                        {purchase.purchaseCode}
                      </span>
                      <span className="text-sm text-gray-600">
                        Order:{" "}
                        <span className="font-mono font-medium text-gray-800">
                          {purchase.orderCode}
                        </span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Purchaser:{" "}
                        <span className="font-medium text-gray-800">
                          {purchase.staffName}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Thời gian mua:{" "}
                      {purchase.purchaseTime
                        ? new Date(purchase.purchaseTime).toLocaleString(
                            "vi-VN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "—"}
                    </p>
                  </div>
                </div>
                {/* Pending links */}
                <div className="mt-4 space-y-3">
                  {(purchase.pendingLinks || []).map((link) => {
                    const normalizedCode = normalizeShipmentCode(
                      link.shipmentCode
                    );
                    const hasShipmentCode = !!normalizedCode;
                    return (
                      <div
                        key={link.linkId}
                        className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-xs text-gray-700">
                              LINK-{link.linkId}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {link.productName}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                            <span>
                              Website:{" "}
                              <span className="font-medium">
                                {link.website || "—"}
                              </span>
                            </span>
                            <span>
                              SL:{" "}
                              <span className="font-medium">
                                {link.quantity}
                              </span>
                            </span>
                            {link.trackingCode && (
                              <span>
                                Tracking:{" "}
                                <span className="font-mono font-medium text-gray-800">
                                  {link.trackingCode}
                                </span>
                              </span>
                            )}
                            {link.classify && (
                              <span className="max-w-[280px] truncate">
                                Phân loại:{" "}
                                <span className="font-medium">
                                  {link.classify}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Truck className="h-4 w-4" />
                            Shipment code:
                          </div>
                          <div className="flex items-center gap-2">
                            {hasShipmentCode ? (
                              <>
                                <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-mono font-semibold text-green-800">
                                  {normalizedCode}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Đã có mã
                                </span>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Chưa có shipment code
                              </span>
                            )}
                          </div>
                          {/* Nút Hủy đơn */}
                          <button
                            onClick={() => openCancelModal(purchase, link)}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Hủy đơn
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        {!loading && purchases.length > 0 && (
          <div className="mt-8 flex items-center justify-between text-sm text-gray-600">
            <div>
              Trang <span className="font-semibold text-gray-800">{page}</span>{" "}
              /{" "}
              <span className="font-semibold text-gray-800">{totalPages}</span>
            </div>
            <div className="flex gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Sau
              </button>
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
        onSuccess={() => fetchData()}
      />
    </div>
  );
};
export default PurchaserList;
