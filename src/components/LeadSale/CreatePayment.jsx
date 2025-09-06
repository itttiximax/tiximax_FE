import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import paymentService from "../../Services/LeadSale/paymentService";

const CreatePayment = () => {
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderCode.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await paymentService.createPayment(orderCode.trim());
      setResult(response);
      toast.success("Tạo thanh toán thành công!");
    } catch (error) {
      console.error("Error creating payment:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Tạo thanh toán thất bại";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOrderCode("");
    setResult(null);
    setError(null);
  };

  const isValidQrCode = (qrCode) => {
    return qrCode && qrCode !== "Mã QR" && qrCode.startsWith("http");
  };

  return (
    <div className="py-4 px-2 bg-gray-50">
      <Toaster />
      <div className="max-w-5xl mx-auto bg-white rounded p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tạo Thanh Toán
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-4">
          <input
            type="text"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            placeholder="Nhập mã đơn hàng (VD: MH-1BF7EB)"
            required
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !orderCode.trim()}
              className="flex-1 bg-blue-600 text-white py-2 rounded text-sm disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Tạo Thanh Toán"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded text-sm disabled:opacity-50"
            >
              Xóa
            </button>
          </div>
        </form>

        {/* Success */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 border border-green-200 rounded p-4">
            {/* QR Code Display */}
            {isValidQrCode(result.qrCode) && (
              <div className="text-center">
                <div className="bg-white p-3 rounded border inline-block">
                  <img
                    src={result.qrCode}
                    alt="QR Code thanh toán"
                    className="w-[640px] h-[640px] object-contain mx-auto cursor-pointer"
                    onClick={() => window.open(result.qrCode, "_blank")}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                    title="Click để xem full size"
                  />
                </div>
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    onClick={() => window.open(result.qrCode, "_blank")}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    Xem to hơn
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = result.qrCode;
                      link.download = `QR-${result.paymentCode}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success("Đang tải QR code...");
                    }}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                  >
                    Tải về
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Quét mã QR để thanh toán
                </p>
              </div>
            )}

            {/* Payment Details */}
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-green-700 text-center">
                Thanh toán được tạo thành công!
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-gray-700">Mã GD:</span>
                  <p className="font-mono text-blue-600">
                    {result.paymentCode}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Đơn hàng:</span>
                  <p className="font-mono">{result.content}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-gray-700">Loại:</span>
                  <p>{result.paymentType}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Trạng thái:
                  </span>
                  <p className="text-orange-600 font-semibold">
                    {result.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-gray-700">Số tiền:</span>
                  <p className="font-bold text-green-600">
                    {result.amount?.toLocaleString()} đ
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Đã thu:</span>
                  <p className="font-bold text-blue-600">
                    {result.collectedAmount?.toLocaleString()} đ
                  </p>
                </div>
              </div>

              {result.actionAt && (
                <div>
                  <span className="font-semibold text-gray-700">
                    Thời gian tạo:
                  </span>
                  <p>{new Date(result.actionAt).toLocaleString("vi-VN")}</p>
                </div>
              )}

              {isValidQrCode(result.qrCode) && (
                <div className="mt-2 pt-2 border-t">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-500">
                      QR Code URL
                    </summary>
                    <p className="mt-1 break-all text-gray-600 bg-gray-100 p-1 rounded">
                      {result.qrCode}
                    </p>
                  </details>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-200 rounded p-3 text-sm">
            <h3 className="font-semibold text-red-700 mb-1">
              Lỗi tạo thanh toán
            </h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePayment;
