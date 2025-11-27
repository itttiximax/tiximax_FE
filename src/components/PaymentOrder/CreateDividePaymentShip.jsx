// src/Components/Payment/CreateDividePaymentShip.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { X, Info, Scissors } from "lucide-react";
import createPaymentShipService from "../../Services/Payment/createPaymentShipService";
import CustomerVoucherPayment from "./CustomerVoucherPayment";
import BankShipList from "./BankShipList";

/** Helper: bóc tách lỗi backend */
const getErrorMessage = (error) => {
  if (error?.response) {
    const be =
      error.response.data?.error ||
      error.response.data?.message ||
      error.response.data?.detail ||
      error.response.data?.errors;
    if (be) {
      if (typeof be === "object" && !Array.isArray(be)) {
        return Object.entries(be)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
      } else if (Array.isArray(be)) return be.join(", ");
      return be;
    }
    return `Lỗi ${error.response.status}: ${
      error.response.statusText || "Không xác định"
    }`;
  } else if (error?.request) return "Không thể kết nối tới server.";
  return error?.message || "Đã xảy ra lỗi không xác định";
};

const DividePaymentShipConfigModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  totalAmount,
  formatCurrency,
  isCreating,
  accountId,
  cachedBankAccounts = [], // ✅ THÊM prop
  bankAccountsLoading = false, // ✅ THÊM prop
}) => {
  const [customerVoucherId, setCustomerVoucherId] = useState(null);
  const [isUseBalance, setIsUseBalance] = useState(true);
  const [voucherLoading, setVoucherLoading] = useState(false);

  const [bankId, setBankId] = useState(null);
  const [bankLoading, setBankLoading] = useState(false);

  // ✅ THÊM: Auto-set bank đầu tiên khi có cached data
  useEffect(() => {
    if (
      cachedBankAccounts &&
      cachedBankAccounts.length > 0 &&
      !bankId &&
      isOpen
    ) {
      setBankId(String(cachedBankAccounts[0].id));
    }
  }, [cachedBankAccounts, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Voucher KHÔNG bắt buộc nữa
  const confirmDisabled =
    isCreating ||
    (Boolean(accountId) && voucherLoading) ||
    bankLoading ||
    !bankId;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Tạo thanh toán vận chuyển (tách đơn)
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
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">
                  Bạn đã chọn {selectedCount} kiện/hành trình tách
                </p>
                <p>Tổng phí ước tính: {formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Voucher (không bắt buộc) */}
          <CustomerVoucherPayment
            accountId={accountId}
            disabled={isCreating}
            value={customerVoucherId}
            onChange={setCustomerVoucherId}
            className="mb-4"
            onLoadingChange={setVoucherLoading}
          />
          {Boolean(accountId) && voucherLoading && (
            <div className="text-xs text-gray-500 -mt-2 mb-2">
              Đang tải voucher...
            </div>
          )}

          {/* Bank */}
          <BankShipList
            disabled={isCreating}
            value={bankId}
            onChange={setBankId}
            className="mb-4"
            label="Chọn tài khoản nhận cước (bắt buộc)"
            onLoadingChange={setBankLoading}
            onAccountsChange={() => {}}
            autoSelectFirst={true} // ✅ THÊM
            cachedAccounts={cachedBankAccounts} // ✅ THÊM
            initialLoading={bankAccountsLoading} // ✅ THÊM
          />
          {!bankId && (
            <div className="text-xs text-amber-600 -mt-3 mb-3">
              Vui lòng chọn tài khoản nhận cước để tiếp tục.
            </div>
          )}

          {/* Checkbox dùng số dư */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isUseBalance}
                onChange={(e) => setIsUseBalance(e.target.checked)}
                disabled={isCreating}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Sử dụng số dư tài khoản
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ưu tiên trừ vào số dư khả dụng
                </p>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Xác nhận:
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Số kiện/chặng tách:</span>
                <span className="font-medium">{selectedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng phí ước tính:</span>
                <span className="font-medium">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Voucher áp dụng:</span>
                <span className="font-medium">
                  {customerVoucherId ? "Có" : "Không"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tài khoản nhận cước:</span>
                <span className="font-medium">
                  {bankId ? "Đã chọn" : "Chưa chọn"}
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
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() =>
              !confirmDisabled &&
              onConfirm({
                customerVoucherId: customerVoucherId ?? null, // cho phép null
                isUseBalance,
                bankId,
              })
            }
            disabled={confirmDisabled}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={
              confirmDisabled
                ? bankLoading
                  ? "Đang tải tài khoản ngân hàng…"
                  : "Vui lòng chọn tài khoản nhận cước"
                : "Xác nhận tạo thanh toán tách đơn"
            }
          >
            {isCreating ? "Đang tạo..." : "Xác nhận tạo thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== Main Button Component ==========
const CreateDividePaymentShip = ({
  selectedShipmentCodes,
  totalAmount,
  formatCurrency,
  onSuccess,
  onError,
  disabled = false,
  accountId,
  cachedBankAccounts = [], // ✅ THÊM prop
  bankAccountsLoading = false, // ✅ THÊM prop
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const openModal = () => {
    if (!selectedShipmentCodes || selectedShipmentCodes.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 tracking để tách đơn");
      return;
    }
    setShowConfigModal(true);
  };

  const closeModal = () => {
    if (!isCreating) setShowConfigModal(false);
  };

  const handleConfirmDividePayment = async ({
    customerVoucherId,
    isUseBalance,
    bankId,
  }) => {
    setShowConfigModal(false);
    try {
      setIsCreating(true);

      const result = await createPaymentShipService.createPartialShipment(
        isUseBalance,
        bankId,
        customerVoucherId ?? null,
        selectedShipmentCodes
      );

      toast.success(
        `Tạo thanh toán tách đơn thành công! Mã: ${
          result?.paymentCode || result?.id || "N/A"
        }`
      );
      onSuccess?.(result);
    } catch (error) {
      const msg = getErrorMessage(error);
      toast.error(`Không thể tạo thanh toán tách đơn: ${msg}`, {
        duration: 5000,
      });
      onError?.(error);
    } finally {
      setIsCreating(false);
    }
  };

  const buttonDisabled =
    disabled ||
    isCreating ||
    !selectedShipmentCodes ||
    selectedShipmentCodes.length < 1;

  return (
    <>
      <button
        onClick={openModal}
        disabled={buttonDisabled}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
        title={
          buttonDisabled
            ? "Hãy chọn ít nhất một tracking để tách đơn"
            : "Tạo thanh toán vận chuyển (tách đơn)"
        }
      >
        {isCreating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Đang tạo...
          </>
        ) : (
          <>Tạo thanh toán tách đơn</>
        )}
      </button>

      <DividePaymentShipConfigModal
        isOpen={showConfigModal}
        onClose={closeModal}
        onConfirm={handleConfirmDividePayment}
        selectedCount={selectedShipmentCodes?.length || 0}
        totalAmount={totalAmount || 0}
        formatCurrency={formatCurrency || ((v) => v)}
        isCreating={isCreating}
        accountId={accountId}
        cachedBankAccounts={cachedBankAccounts} // ✅ THÊM
        bankAccountsLoading={bankAccountsLoading} // ✅ THÊM
      />
    </>
  );
};

export default CreateDividePaymentShip;
