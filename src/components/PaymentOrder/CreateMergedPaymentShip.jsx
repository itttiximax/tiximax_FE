// src/Components/Payment/CreateMergedPaymentShip.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { X, Info, Truck } from "lucide-react";
import createPaymentShipService from "../../Services/Payment/createPaymentShipService";
import CustomerVoucherPayment from "./CustomerVoucherPayment";

/** Helper: Bóc tách lỗi backend để hiện toast dễ hiểu */
const getErrorMessage = (error) => {
  if (error?.response) {
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
  } else if (error?.request) {
    return "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.";
  }
  return error?.message || "Đã xảy ra lỗi không xác định";
};

/* =========================
 * Modal cấu hình tạo thanh toán ship (gộp)
 * ========================= */
const MergedPaymentShipConfigModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  totalAmount,
  formatCurrency,
  isCreating,
  accountId, // nhận từ cha để show voucher theo account
}) => {
  const [customerVoucherId, setCustomerVoucherId] = useState(null); // number|null
  const [isUseBalance, setIsUseBalance] = useState(true);

  const handleSubmit = () => {
    onConfirm(customerVoucherId ?? null, isUseBalance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Thanh toán vận chuyển
            </h3>
            <button
              onClick={onClose}
              disabled={isCreating}
              className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Thông tin tổng quan */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  Bạn đã chọn {selectedCount} đơn hàng vận chuyển
                </p>
                <p>Tổng phí vận chuyển: {formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Voucher theo account (component tách riêng) */}
          <CustomerVoucherPayment
            accountId={accountId}
            disabled={isCreating}
            value={customerVoucherId}
            onChange={setCustomerVoucherId}
            className="mb-4"
          />

          {/* Checkbox dùng số dư */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isUseBalance}
                onChange={(e) => setIsUseBalance(e.target.checked)}
                disabled={isCreating}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Sử dụng số dư tài khoản
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sử dụng số dư có sẵn trong tài khoản để thanh toán
                </p>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Xác nhận đơn hàng:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số đơn hàng:</span>
                <span className="font-medium">{selectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng phí vận chuyển:</span>
                <span className="font-medium">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Voucher áp dụng:</span>
                <span className="font-medium">
                  {customerVoucherId
                    ? `ID KH: ${customerVoucherId}`
                    : "Không có"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sử dụng số dư:</span>
                <span className="font-medium">
                  {isUseBalance ? "Có" : "Không"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              "Xác nhận tạo thanh toán"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
 * Nút/Tác vụ tạo thanh toán ship (gộp)
 * ========================= */
const CreateMergedPaymentShip = ({
  selectedOrders, // mảng orderCode
  totalAmount,
  formatCurrency,
  onSuccess,
  onError,
  disabled = false,
  accountId, // 🔹 nhận từ cha để show voucher theo account
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const openModal = () => {
    if (!selectedOrders || selectedOrders.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 đơn hàng để tạo thanh toán");
      return;
    }
    setShowConfigModal(true);
  };

  const closeModal = () => {
    if (!isCreating) setShowConfigModal(false);
  };

  // Xác nhận từ modal: gọi API tạo thanh toán
  const handleConfirmMergedPayment = async (
    customerVoucherId, // number|null
    isUseBalance
  ) => {
    setShowConfigModal(false);

    try {
      setIsCreating(true);

      // Gọi API tạo thanh toán ship (gộp) — điều chỉnh cho khớp service của bạn
      // createPaymentShipService.createPaymentShipping(isUseBalance, customerVoucherId, orderCodes[])
      const result = await createPaymentShipService.createPaymentShipping(
        isUseBalance,
        customerVoucherId ?? null,
        selectedOrders
      );

      toast.success(
        `Tạo thanh toán vận chuyển ${
          selectedOrders.length > 1 ? "gộp " : ""
        }thành công! Mã thanh toán: ${
          result?.paymentCode || result?.id || "N/A"
        }`
      );

      onSuccess?.(result);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể tạo thanh toán vận chuyển: ${errorMessage}`, {
        duration: 5000,
      });
      onError?.(error);
    } finally {
      setIsCreating(false);
    }
  };

  const buttonDisabled =
    disabled || isCreating || !selectedOrders || selectedOrders.length < 1;

  return (
    <>
      <button
        onClick={openModal}
        disabled={buttonDisabled}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        title={
          buttonDisabled
            ? "Hãy chọn ít nhất một đơn để tạo thanh toán"
            : "Tạo thanh toán vận chuyển"
        }
      >
        {isCreating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Đang tạo...
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 mr-2" />
            {selectedOrders?.length > 1
              ? "Tạo thanh toán ship gộp"
              : "Tạo thanh toán ship"}
          </>
        )}
      </button>

      <MergedPaymentShipConfigModal
        isOpen={showConfigModal}
        onClose={closeModal}
        onConfirm={handleConfirmMergedPayment}
        selectedCount={selectedOrders?.length || 0}
        totalAmount={totalAmount || 0}
        formatCurrency={formatCurrency || ((v) => v)}
        isCreating={isCreating}
        accountId={accountId} // 🔹 truyền xuống modal để hiển thị <CustomerVoucherPayment />
      />
    </>
  );
};

export default CreateMergedPaymentShip;
