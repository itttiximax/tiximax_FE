import React, { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createShipment } from "../../Services/Warehouse/warehouseShipmentService";

const normalizeCode = (raw) =>
  String(raw || "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

const codeIsValid = (code) => /^[A-Z0-9._-]{6,64}$/.test(code);

const ImportProduct = () => {
  const [scanValue, setScanValue] = useState("");
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const listEndRef = useRef(null);
  const scanInputRef = useRef(null);

  useEffect(() => {
    scanInputRef.current?.focus();
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [codes.length]);

  const lineErrors = useMemo(() => {
    const map = new Map();
    const seen = new Set();
    codes.forEach((c) => {
      const invalid = !codeIsValid(c);
      const duplicate = seen.has(c);
      map.set(c, { invalid, duplicate });
      seen.add(c);
    });
    return map;
  }, [codes]);

  const hasAnyError = useMemo(
    () =>
      codes.some(
        (c) => lineErrors.get(c)?.invalid || lineErrors.get(c)?.duplicate
      ),
    [codes, lineErrors]
  );

  const addCode = (raw) => {
    const code = normalizeCode(raw);
    if (!code) return;

    if (codes.includes(code)) {
      toast.error("Mã đã tồn tại trong danh sách");
      return;
    }

    setCodes((prev) => [...prev, code]);
    toast.success("Đã thêm mã");
  };

  const addManyCodes = (listRaw) => {
    const arr = listRaw
      .split(/[\n,\s]+/)
      .map(normalizeCode)
      .filter(Boolean);

    if (arr.length === 0) return;

    let addedCount = 0;
    setCodes((prev) => {
      const merged = [...prev];
      arr.forEach((c) => {
        if (!merged.includes(c)) {
          merged.push(c);
          addedCount++;
        }
      });
      return merged;
    });

    if (addedCount > 0) {
      toast.success(`Đã thêm ${addedCount} mã`);
    }
  };

  const handleScanKeyDown = (e) => {
    if (e.key === "Enter" && scanValue.trim()) {
      e.preventDefault();
      addCode(scanValue);
      setScanValue("");
    }
  };

  const handleScanPaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (text && /[\n,\s]/.test(text)) {
      e.preventDefault();
      addManyCodes(text);
      setScanValue("");
    }
  };

  const removeCode = (idx) => {
    setCodes((prev) => prev.filter((_, i) => i !== idx));
    toast("Đã xóa mã", { icon: "🗑️" });
  };

  const clearAll = () => {
    setCodes([]);
    setResults([]);
    scanInputRef.current?.focus();
    toast("Đã xóa tất cả", { icon: "🧹" });
  };

  const handleSubmit = async () => {
    setResults([]);

    if (codes.length === 0) {
      toast.error("Danh sách mã trống");
      return;
    }

    if (hasAnyError) {
      toast.error("Vui lòng kiểm tra lại mã không hợp lệ hoặc trùng");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(`Đang xử lý ${codes.length} mã...`);

    try {
      const settled = await Promise.allSettled(
        codes.map((shipmentId) => createShipment(shipmentId, {}))
      );

      const lineResults = settled.map((res, i) => {
        const code = codes[i];
        if (res.status === "fulfilled") {
          return { code, ok: true, data: res.value };
        }
        let errorMessage = "Unknown error";
        const err = res.reason;
        if (err?.response?.data?.error) errorMessage = err.response.data.error;
        else if (err?.response?.data?.message)
          errorMessage = err.response.data.message;
        else if (err?.message) errorMessage = err.message;
        return { code, ok: false, error: errorMessage };
      });

      setResults(lineResults);
      const okCount = lineResults.filter((r) => r.ok).length;
      const failCount = lineResults.length - okCount;

      toast.dismiss(loadingToast);

      if (okCount === lineResults.length) {
        toast.success(`Tất cả ${okCount} mã đã được import thành công!`);
      } else if (okCount > 0) {
        toast.success(`${okCount} mã thành công, ${failCount} mã thất bại`);
      } else {
        toast.error("Tất cả mã đều thất bại");
      }
    } catch (e) {
      toast.dismiss(loadingToast);
      let errorMessage = "Đã xảy ra lỗi không xác định";
      if (e?.response?.data?.error) errorMessage = e.response.data.error;
      else if (e?.response?.data?.message)
        errorMessage = e.response.data.message;
      else if (e?.message) errorMessage = e.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Import Product
        </h2>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scan hoặc nhập mã
                </label>
                <input
                  ref={scanInputRef}
                  type="text"
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  onKeyDown={handleScanKeyDown}
                  onPaste={handleScanPaste}
                  placeholder="Enter để thêm, paste nhiều mã..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || codes.length === 0 || hasAnyError}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Submit (${codes.length})`
                  )}
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Statistics */}
              {codes.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng mã:</span>
                    <span className="font-semibold">{codes.length}</span>
                  </div>
                  {results.length > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Thành công:</span>
                        <span className="font-semibold text-green-600">
                          {results.filter((r) => r.ok).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Thất bại:</span>
                        <span className="font-semibold text-red-600">
                          {results.filter((r) => !r.ok).length}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-lg p-4 h-[500px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Danh sách mã</h3>
                {hasAnyError && (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                    Có lỗi
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-auto">
                {codes.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-400">Chưa có mã nào</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {codes.map((c, idx) => {
                      const err = lineErrors.get(c);
                      const isBad = err?.invalid || err?.duplicate;
                      const result = results[idx];

                      return (
                        <li
                          key={`${c}-${idx}`}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                            isBad
                              ? "border-red-200 bg-red-50"
                              : result?.ok === false
                              ? "border-red-200 bg-red-50"
                              : result?.ok === true
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-mono text-sm truncate">
                              {c}
                            </span>
                            {err?.duplicate && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 whitespace-nowrap">
                                Trùng
                              </span>
                            )}
                            {err?.invalid && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap">
                                Sai format
                              </span>
                            )}
                            {result?.ok === true && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                ✓ OK
                              </span>
                            )}
                            {result?.ok === false && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 truncate max-w-[200px]"
                                title={result.error}
                              >
                                {result.error}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeCode(idx)}
                            className="ml-2 text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Xóa"
                          >
                            <svg
                              className="w-4 h-4"
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
                        </li>
                      );
                    })}
                    <div ref={listEndRef} />
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportProduct;
