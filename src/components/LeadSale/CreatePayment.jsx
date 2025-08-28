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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Toaster />
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Tạo Thanh Toán
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            placeholder="Nhập mã đơn hàng (VD: MH-1BF7EB)"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !orderCode.trim()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Tạo Thanh Toán"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Xóa
            </button>
          </div>
        </form>

        {/* Success */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-green-700 mb-2">
              Kết quả thành công
            </h3>
            <p>Mã GD: {result.paymentCode}</p>
            <p>Đơn hàng: {result.content}</p>
            <p>Loại: {result.paymentType}</p>
            <p>Số tiền: {result.amount?.toLocaleString()} đ</p>
            <p>Đã thu: {result.collectedAmount?.toLocaleString()} đ</p>
            <p>Trạng thái: {result.status}</p>
            {result.qrCode && result.qrCode !== "Mã QR" && (
              <p>Mã QR: {result.qrCode}</p>
            )}
            {result.actionAt && (
              <p>
                Thời gian tạo:{" "}
                {new Date(result.actionAt).toLocaleString("vi-VN")}
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-red-700 mb-2">
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
