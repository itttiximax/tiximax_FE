import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Truck, X } from "lucide-react";
import createPaymentShipService from "../../Services/Payment/createPaymentShipService";

// Helper: bóc tách lỗi backend
const getErrorMessage = (error) => {
  if (error.response) {
    const backendError =
      error.response.data?.error ||
      error.response.data?.message ||
      error.response.data?.detail ||
      error.response.data?.errors;

    if (backendError) {
      if (typeof backendError === "object" && !Array.isArray(backendError)) {
        const errorMessages = Object.entries(backendError)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(", ");
        return `Lỗi validation: ${errorMessages}`;
      } else if (Array.isArray(backendError)) {
        return backendError.join(", ");
      } else {
        return backendError;
      }
    }
    return `Lỗi ${error.response.status}: ${
      error.response.statusText || "Không xác định"
    }`;
  } else if (error.request) {
    return "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.";
  }
  return error.message || "Đã xảy ra lỗi không xác định";
};

const CreateMergedPaymentShip = ({
  selectedOrders,
  selectedCount,
  totalAmount,
  onSuccess,
  formatCurrency,
}) => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [voucherId, setVoucherId] = useState("");
  const [isUseBalance, setIsUseBalance] = useState(true);
  const [result, setResult] = useState(null); // hiển thị kết quả sau khi tạo

  // 1) Nhấn nút -> mở dialog
  const handleOpenDialog = () => {
    if (!selectedOrders || selectedOrders.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 đơn hàng vận chuyển để thanh toán");
      return;
    }
    setOpenDialog(true);
  };

  // 2) Trong dialog -> gọi API tạo thanh toán
  const handleConfirmCreate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thực hiện thanh toán");
      return;
    }

    try {
      setLoading(true);
      const res = await createPaymentShipService.createPaymentShipping(
        isUseBalance,
        voucherId || "null",
        selectedOrders
      );

      setResult(res);
      setOpenDialog(false); // đóng dialog sau khi tạo xong

      toast.success(
        `Tạo thanh toán vận chuyển gộp thành công${
          res?.paymentCode ? ` (Mã: ${res.paymentCode})` : ""
        }`
      );

      if (onSuccess) onSuccess(res);
    } catch (error) {
      console.error("Error creating merged shipping payment:", error);
      toast.error(
        `Không thể tạo thanh toán vận chuyển gộp: ${getErrorMessage(error)}`,
        {
          duration: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Thông tin đã chọn */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            Đã chọn: {selectedCount} đơn hàng
          </span>
          <span className="text-sm font-medium text-gray-900">
            Tổng: {formatCurrency(totalAmount)}
          </span>
        </div>
      )}

      {/* Nút mở dialog */}
      <button
        onClick={handleOpenDialog}
        disabled={selectedCount === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
      >
        <Truck className="w-4 h-4 mr-2" />
        Tạo thanh toán ship gộp
      </button>

      {/* Dialog nhập voucher + isUseBalance */}
      {openDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setOpenDialog(false)}
          />
          {/* content */}
          <div className="relative bg-white rounded-xl shadow-xl p-5 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">
                Xác nhận tạo thanh toán
              </h3>
              <button
                onClick={() => !loading && setOpenDialog(false)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">
                  Mã voucher (nếu có)
                </label>
                <input
                  type="text"
                  placeholder="Nhập mã voucher"
                  value={voucherId}
                  onChange={(e) => setVoucherId(e.target.value)}
                  className="mt-1 border rounded-lg px-3 py-2 text-sm w-full"
                  disabled={loading}
                />
              </div>

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={isUseBalance}
                  onChange={(e) => setIsUseBalance(e.target.checked)}
                  disabled={loading}
                />
                <span>Dùng số dư tài khoản</span>
              </label>

              <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                <div>
                  Đơn hàng đã chọn: <b>{selectedCount}</b>
                </div>
                <div>
                  Tổng phí ước tính: <b>{formatCurrency(totalAmount)}</b>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => !loading && setOpenDialog(false)}
                className="px-3 py-2 rounded-lg text-sm border hover:bg-gray-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo thanh toán"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kết quả sau khi tạo */}
      {result && (
        <div className="border rounded-lg p-3 bg-green-50">
          <div className="text-sm font-semibold text-green-800 mb-1">
            Tạo thanh toán thành công
          </div>
          <div className="text-sm text-green-900 space-y-1">
            {result.paymentCode && (
              <div>
                Mã thanh toán: <b>{result.paymentCode}</b>
              </div>
            )}
            {result.amount && (
              <div>
                Số tiền: <b>{formatCurrency(result.amount)}</b>
              </div>
            )}
            {result.status && (
              <div>
                Trạng thái: <b>{result.status}</b>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMergedPaymentShip;
