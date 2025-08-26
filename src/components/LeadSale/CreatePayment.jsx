import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle,
  AlertTriangle,
  Loader,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import createPaymentService from "../../Services/LeadSale/createPaymentService";

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
      const response = await createPaymentService(orderCode.trim());
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tạo Thanh Toán
            </h1>
            <p className="text-gray-600 mt-1">Tạo thanh toán cho đơn hàng</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Code Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mã đơn hàng *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Nhập mã đơn hàng (VD: MH-1BF7EB)"
                  required
                />
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Mã đơn hàng có định dạng: MH-XXXXXX
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !orderCode.trim()}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <DollarSign size={20} />
                )}
                <span>{loading ? "Đang xử lý..." : "Tạo Thanh Toán"}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="px-6 py-4 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Xóa
              </button>
            </div>
          </form>

          {/* Results Section */}
          {(result || error) && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Kết quả</h3>

              {/* Success Result */}
              {result && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-500" size={24} />
                    <h4 className="font-semibold text-green-800">
                      Tạo thanh toán thành công
                    </h4>
                  </div>

                  {/* Payment Details Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-600">
                          Thông tin thanh toán
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Mã GD:</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {result.paymentCode}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Đơn hàng:
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            {result.content}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Loại:</span>
                          <span className="text-sm font-semibold text-blue-600">
                            {result.paymentType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-gray-600">
                          Số tiền
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Số tiền:
                          </span>
                          <span className="text-sm font-semibold text-green-600">
                            {result.amount?.toLocaleString()} đ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Đã thu:</span>
                          <span className="text-sm font-semibold text-green-600">
                            {result.collectedAmount?.toLocaleString()} đ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">
                            Trạng thái:
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              result.status === "CHO_THANH_TOAN"
                                ? "bg-orange-100 text-orange-800"
                                : result.status === "DA_THANH_TOAN"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {result.status === "CHO_THANH_TOAN"
                              ? "Chờ thanh toán"
                              : result.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  {result.qrCode && result.qrCode !== "Mã QR" && (
                    <div className="bg-white rounded-xl p-4 border border-green-100 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm font-medium text-gray-600">
                          Mã QR
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <span className="text-gray-700 font-mono">
                          {result.qrCode}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  {result.actionAt && (
                    <div className="bg-white rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">
                          Thời gian tạo
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {new Date(result.actionAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Result */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-500" size={24} />
                    <h4 className="font-semibold text-red-800">
                      Lỗi tạo thanh toán
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
