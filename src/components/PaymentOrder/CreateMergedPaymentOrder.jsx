// CreateMergedPaymentOrder.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import mergedPaymentService from "../../Services/Payment/mergedPaymentService";
import { CreditCard as PaymentIcon, X, Info, Edit2, Check } from "lucide-react";

// Helper function to extract error message from backend
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

// Merged Payment Config Modal Component
const MergedPaymentConfigModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  totalAmount,
  formatCurrency,
  isCreating,
}) => {
  const [depositPercent, setDepositPercent] = useState(100);
  const [isUseBalance, setIsUseBalance] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditingDeposit, setIsEditingDeposit] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const numValue = depositPercent === "" ? 0 : depositPercent;

    if (numValue < 0) {
      newErrors.depositPercent = "Phần trăm cọc không thể âm";
    }
    if (numValue > 100) {
      newErrors.depositPercent = "Phần trăm cọc không thể vượt quá 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const finalDepositPercent = depositPercent === "" ? 0 : depositPercent;
      onConfirm(finalDepositPercent, isUseBalance);
      setIsEditingDeposit(false); // Reset edit mode after submit
    }
  };

  const handleDepositPercentChange = (e) => {
    const value = e.target.value;

    // Nếu xóa hết thì để trống
    if (value === "") {
      setDepositPercent("");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setDepositPercent(numValue);
      }
    }

    if (errors.depositPercent) {
      setErrors({});
    }
  };

  const calculateDepositAmount = () => {
    const percent = depositPercent === "" ? 0 : depositPercent;
    return (totalAmount * percent) / 100;
  };

  const handleToggleEditDeposit = () => {
    setIsEditingDeposit(!isEditingDeposit);
  };

  const handleClose = () => {
    setIsEditingDeposit(false); // Reset edit mode when closing
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Thanh toán {selectedCount > 1 ? "gộp" : ""}
            </h3>
            <button
              onClick={handleClose}
              disabled={isCreating}
              className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  Bạn đã chọn {selectedCount} đơn hàng
                  {selectedCount > 1 ? "" : ""}
                </p>
                <p>Tổng giá trị: {formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Deposit Percent Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
              <span>
                Phần trăm tiền cọc <span className="text-red-500">*</span>
              </span>
              <button
                type="button"
                onClick={handleToggleEditDeposit}
                disabled={isCreating}
                className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-colors ${
                  isEditingDeposit
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isEditingDeposit ? "Xác nhận" : "Chỉnh sửa"}
              >
                {isEditingDeposit ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Xác nhận</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </>
                )}
              </button>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={depositPercent}
                onChange={handleDepositPercentChange}
                disabled={isCreating || !isEditingDeposit}
                className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  !isEditingDeposit
                    ? "bg-gray-50 cursor-not-allowed"
                    : "bg-white"
                } ${isCreating ? "bg-gray-100 cursor-not-allowed" : ""} ${
                  errors.depositPercent
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Nhập phần trăm tiền cọc (0-100)"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">%</span>
            </div>
            {errors.depositPercent && (
              <p className="mt-1 text-sm text-red-600">
                {errors.depositPercent}
              </p>
            )}
            {!isEditingDeposit && (
              <p className="mt-1 text-xs text-gray-500">
                Nhấn nút "Sửa" để thay đổi phần trăm tiền cọc
              </p>
            )}

            {/* Deposit Amount Preview */}
            {(depositPercent === "" || depositPercent > 0) && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số tiền cọc:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(calculateDepositAmount())}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Còn lại:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totalAmount - calculateDepositAmount())}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Use Balance Field */}
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
              Thông tin xác nhận:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số đơn hàng:</span>
                <span className="font-medium">{selectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phần trăm cọc:</span>
                <span className="font-medium">
                  {depositPercent === "" ? 0 : depositPercent}%
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
            onClick={handleClose}
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
              `Xác nhận tạo thanh toán${selectedCount > 1 ? " gộp" : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CreateMergedPaymentOrder Component
const CreateMergedPaymentOrder = ({
  selectedOrders,
  totalAmount,
  formatCurrency,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Open config modal
  const handleOpenConfigModal = () => {
    if (selectedOrders.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 đơn hàng để tạo thanh toán");
      return;
    }
    setShowConfigModal(true);
  };

  // Create merged payment with config
  const handleConfirmMergedPayment = async (depositPercent, isUseBalance) => {
    try {
      setIsCreating(true);

      // Call the mergedPaymentService with the correct parameters
      const result = await mergedPaymentService.mergePayments(
        depositPercent,
        isUseBalance,
        selectedOrders // This is the array of payment IDs
      );

      toast.success(
        `Tạo thanh toán ${
          selectedOrders.length > 1 ? "gộp " : ""
        }thành công! Mã thanh toán: ${result.paymentCode || result.id || "N/A"}`
      );

      // Close modal
      setShowConfigModal(false);

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error creating merged payment:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể tạo thanh toán: ${errorMessage}`, {
        duration: 5000,
      });

      // Call error callback
      if (onError) {
        onError(error);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Create Merged Payment Button */}
      <button
        onClick={handleOpenConfigModal}
        disabled={disabled || isCreating || selectedOrders.length < 1}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
      >
        {isCreating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Đang tạo...
          </>
        ) : (
          <>
            <PaymentIcon className="w-4 h-4 mr-2" />
            {selectedOrders.length > 1
              ? "Tạo thanh toán gộp"
              : "Tạo thanh toán"}
          </>
        )}
      </button>

      {/* Merged Payment Config Modal */}
      <MergedPaymentConfigModal
        isOpen={showConfigModal}
        onClose={() => !isCreating && setShowConfigModal(false)}
        onConfirm={handleConfirmMergedPayment}
        selectedCount={selectedOrders.length}
        totalAmount={totalAmount}
        formatCurrency={formatCurrency}
        isCreating={isCreating}
      />
    </>
  );
};

export default CreateMergedPaymentOrder;
