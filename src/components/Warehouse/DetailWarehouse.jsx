// Components/Warehouse/DetailWarehouse.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, X, Clipboard, Check } from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";

const DetailWarehouse = ({ open, warehouseId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusBadge = useMemo(() => {
    const s = (detail?.status || "").toUpperCase();
    const map = {
      READY: "bg-blue-100 text-blue-700",
      PENDING: "bg-amber-100 text-amber-700",
      STORED: "bg-slate-100 text-slate-700",
      PACKED: "bg-indigo-100 text-indigo-700",
      ERROR: "bg-red-100 text-red-700",
      DONE: "bg-green-100 text-green-700",
    };
    return map[s] || "bg-gray-100 text-gray-700";
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

  const copyId = async () => {
    if (!warehouseId) return;
    await navigator.clipboard.writeText(String(warehouseId));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={cardRef}
        className="w-full max-w-xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Chi tiết kho hàng
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyId}
              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              title="Copy ID"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Đã copy
                </>
              ) : (
                <>
                  <Clipboard className="h-3.5 w-3.5" />
                  Copy ID
                </>
              )}
            </button>
            <button
              onClick={fetchDetail}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              title="Tải lại"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Tải lại
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              title="Đóng"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
              </div>
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            </div>
          ) : err ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : (
            <>
              {/* Top line: status + createdAt */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge}`}
                >
                  {detail?.status || "UNKNOWN"}
                </span>
                <span className="text-xs text-gray-500">
                  Tạo lúc: {formatDate(detail?.createdAt)}
                </span>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Tracking Code</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold text-gray-900">
                    {detail?.trackingCode || "-"}
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Mã đơn</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {detail?.orderCode || "-"}
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Cân nặng</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {detail?.weight ?? "-"} kg
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">TL thực</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {detail?.netWeight ?? "-"} kg
                  </div>
                </div>

                <div className="rounded-xl border p-3 md:col-span-2">
                  <div className="text-xs text-gray-500">Kích thước (Dim)</div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900">
                    {detail?.dim || "-"}
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-4 rounded-xl border p-3">
                <div className="text-xs text-gray-500">Ghi chú</div>
                <div className="mt-1 text-sm text-gray-800">
                  {detail?.note || "Không có ghi chú"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailWarehouse;
