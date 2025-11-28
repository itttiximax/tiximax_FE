import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, X, Clipboard, Check } from "lucide-react";
import warehouseService from "../../Services/Warehouse/warehouseService";

const DetailWarehouse = ({ open, warehouseId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const cardRef = useRef(null);

  const formatDate = (v) => {
    if (!v) return "-";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Normalize backend Vietnamese to English status codes
  const normalizeStatusCode = (rawStatus) => {
    if (!rawStatus) return null;
    const s = String(rawStatus).toUpperCase().trim();

    const map = {
      DA_NHAP_KHO: "STORED",
      DANG_DONG_GOI: "PACKED",
      DA_HOAN_THANH: "DONE",

      READY: "READY",
      PENDING: "PENDING",
      STORED: "STORED",
      PACKED: "PACKED",
      ERROR: "ERROR",
      DONE: "DONE",
    };

    return map[s] || s;
  };

  // Display readable English labels
  const displayStatus = (rawStatus) => {
    const code = normalizeStatusCode(rawStatus);

    const labelMap = {
      READY: "Ready",
      PENDING: "Pending",
      STORED: "Stored in Warehouse",
      PACKED: "Packed",
      ERROR: "Error",
      DONE: "Completed",
    };

    return labelMap[code] || "Unknown";
  };

  const statusBadge = useMemo(() => {
    const code = normalizeStatusCode(detail?.status);

    const map = {
      READY: "bg-blue-100 text-blue-700 ring-blue-200",
      PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
      STORED: "bg-slate-100 text-slate-700 ring-slate-200",
      PACKED: "bg-indigo-100 text-indigo-700 ring-indigo-200",
      ERROR: "bg-red-100 text-red-700 ring-red-200",
      DONE: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    };

    return map[code] || "bg-gray-100 text-gray-700 ring-gray-200";
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
      setErr("Failed to load warehouse details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sticky top-0 bg-white z-10">
          <div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Warehouse Details
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Close"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="bg-gray-50/60 px-5 py-4">
          {loading ? (
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
                      {displayStatus(detail.status)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created at:{" "}
                    <span className="font-medium text-gray-700">
                      {formatDate(detail.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Images */}
                {(detail.image || detail.imageCheck) && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {detail.image && (
                      <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">
                          Warehouse Image
                        </div>
                        <img
                          src={detail.image}
                          alt="Warehouse"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                          onClick={() => setPreviewImage(detail.image)}
                        />
                      </div>
                    )}

                    {detail.imageCheck && (
                      <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">
                          Check Image
                        </div>
                        <img
                          src={detail.imageCheck}
                          alt="Check"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                          onClick={() => setPreviewImage(detail.imageCheck)}
                        />
                      </div>
                    )}
                  </div>
                )}

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
                      Order Code
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.orderCode || "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Weight (Gross)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.weight != null ? `${detail.weight} kg` : "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Weight (Net)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.netWeight != null
                        ? `${detail.netWeight} kg`
                        : "-"}
                    </div>
                  </div>
                </div>

                {/* Dimensions - Detailed */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Length
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.length != null ? `${detail.length} cm` : "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Width
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.width != null ? `${detail.width} cm` : "-"}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                    <div className="text-xs font-medium text-gray-500">
                      Height
                    </div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {detail.height != null ? `${detail.height} cm` : "-"}
                    </div>
                  </div>
                </div>

                {/* Volume */}
                <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                  <div className="text-xs font-medium text-gray-500">
                    Volume (CBM)
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {detail.dim != null ? `${detail.dim} m³` : "-"}
                  </div>
                </div>

                {/* Notes */}
                <div className="rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-gray-500">
                      Notes
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                    {detail.note || "No notes"}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2 bg-black/50 px-3 py-2 rounded-lg"
            >
              <span className="text-sm font-medium">Close</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailWarehouse;
