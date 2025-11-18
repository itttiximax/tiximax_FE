// Components/Warehouse/DetailWarehouse.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, X, Clipboard, Check } from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";

const DetailWarehouse = ({ open, warehouseId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const cardRef = useRef(null);

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusBadge = useMemo(() => {
    const s = (detail?.status || "").toUpperCase();
    const map = {
      READY: "bg-blue-100 text-blue-700 ring-blue-200",
      PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
      STORED: "bg-slate-100 text-slate-700 ring-slate-200",
      PACKED: "bg-indigo-100 text-indigo-700 ring-indigo-200",
      ERROR: "bg-red-100 text-red-700 ring-red-200",
      DONE: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    };
    return map[s] || "bg-gray-100 text-gray-700 ring-gray-200";
  }, [detail]);

  const fetchDetail = async () => {
    if (!open || warehouseId === undefined || warehouseId === null) return;
    setLoading(true);
    setErr("");
    try {
      const data = await warehouseService.getWarehouseById(warehouseId);
      setDetail(data);
    } catch {
      setDetail(null);
      setErr("Không thể tải chi tiết kho hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, warehouseId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-3 sm:px-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Chi tiết kho hàng
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-red-400 hover:bg-gray-100 hover:text-gray-600"
              title="Đóng"
              aria-label="Đóng"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="bg-gray-50/60 px-5 py-4">
          {loading ? (
            // Skeleton loading
            <div className="space-y-4">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="h-16 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-16 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-16 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-16 animate-pulse rounded-xl bg-gray-200" />
              </div>
              <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
            </div>
          ) : err ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : (
            detail && (
              <div className="space-y-4">
                {/* Status & time */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 ${statusBadge}`}
                    >
                      {detail.status || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Tạo lúc:{" "}
                    <span className="font-medium text-gray-700">
                      {formatDate(detail.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Tracking Code
                    </div>
                    <div className="mt-1 font-mono text-sm font-semibold text-gray-900 break-all">
                      {detail.trackingCode || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Mã đơn
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.orderCode || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Cân nặng (Gross)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.weight != null ? `${detail.weight} kg` : "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      TL thực (Net)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.netWeight != null
                        ? `${detail.netWeight} kg`
                        : "-"}
                    </div>
                  </div>

                  <div className="md:col-span-2 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Kích thước (Dim)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.dim || "-"}
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-500">
                      Ghi chú
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                    {detail.note || "Không có ghi chú"}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailWarehouse;
