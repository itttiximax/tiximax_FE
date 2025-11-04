// src/Components/Payment/ConfirmPayment.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  CreditCard,
  Truck,
  FileText,
  User,
  AlertTriangle,
  CheckCircle as CheckIcon,
  Loader2,
} from "lucide-react";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";

const formatCurrency = (v) => {
  if (v === null || v === undefined || isNaN(Number(v))) return "—";
  try {
    return new Intl.NumberFormat("vi-VN").format(Number(v));
  } catch {
    return String(v);
  }
};

// === Helper gộp từ ConfirmPaymentOrder.jsx (đã bỏ token vì interceptor lo rồi) ===
async function confirmPaymentOrderUnified({ paymentCode }) {
  if (!paymentCode) {
    return { success: false, message: "Thiếu mã thanh toán (paymentCode)" };
  }
  try {
    const res = await confirmPaymentService.confirmPayment(paymentCode);
    return { success: true, data: res };
  } catch (error) {
    if (error?.response) {
      const backendError =
        error.response.data?.error ||
        error.response.data?.message ||
        error.response.data?.detail ||
        error.response.data?.errors;

      let message = `Lỗi ${error.response.status}: ${
        error.response.statusText || "Không xác định"
      }`;

      if (backendError) {
        if (typeof backendError === "object" && !Array.isArray(backendError)) {
          const errorMessages = Object.entries(backendError)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(", ");
          message = `Lỗi validation: ${errorMessages}`;
        } else if (Array.isArray(backendError)) {
          message = backendError.join(", ");
        } else {
          message = backendError;
        }
      }
      return { success: false, message };
    } else if (error?.request) {
      return {
        success: false,
        message: "Không thể kết nối tới server. Vui lòng kiểm tra mạng.",
      };
    }
    return { success: false, message: error?.message || "Lỗi không xác định" };
  }
}

const ConfirmPayment = ({
  order,
  mode = "order", // "order" | "ship"
  onDone = async () => {},
  confirmWithDialog, // undefined => mặc định: order=true, ship=false
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const effectiveConfirmWithDialog =
    typeof confirmWithDialog === "boolean"
      ? confirmWithDialog
      : mode === "order"; // giữ behavior cũ

  const amount = order?.finalPriceOrder ?? order?.finalPrice;
  const paymentCodeOrder = order?.paymentCode;
  const paymentCodeShip = order?.shippingPaymentCode || order?.paymentCode; // ưu tiên shippingPaymentCode

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      // Kiểm tra login (nếu cần), ở đây interceptor sẽ tự add JWT
      const paymentCode = mode === "ship" ? paymentCodeShip : paymentCodeOrder;
      if (!paymentCode || !String(paymentCode).trim()) {
        toast.error(
          mode === "ship"
            ? "Không tìm thấy mã thanh toán vận chuyển"
            : "Không tìm thấy mã thanh toán"
        );
        return;
      }

      if (mode === "ship") {
        // Xác nhận thanh toán ship
        const result = await confirmPaymentService.confirmShippingPayment(
          paymentCode
        );
        const msg =
          result?.message ||
          result?.data?.message ||
          `Xác nhận thanh toán ship thành công cho đơn ${
            order?.orderCode || order?.code || ""
          }!`;
        toast.success(msg);
      } else {
        // Xác nhận thanh toán order (dùng helper đã gộp)
        const res = await confirmPaymentOrderUnified({ paymentCode });
        if (res?.success) {
          toast.success(
            `Xác nhận thanh toán thành công cho đơn ${
              order?.orderCode || order?.code || ""
            }!`
          );
        } else {
          throw new Error(res?.message || "Không thể xác nhận thanh toán");
        }
      }

      setOpen(false);
      await onDone();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        (mode === "ship"
          ? "Không thể xác nhận thanh toán vận chuyển"
          : "Không thể xác nhận thanh toán");
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const ButtonIcon = mode === "ship" ? Truck : CheckIcon;
  const buttonLabel =
    mode === "ship" ? "Xác nhận thanh toán ship" : "Xác nhận thanh toán";
  const buttonColor =
    mode === "ship"
      ? processing
        ? "bg-gray-100 text-gray-400 border border-gray-200"
        : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
      : processing
      ? "bg-gray-100 text-gray-400 border border-gray-200"
      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm";

  return (
    <>
      {/* Nút hành động */}
      <button
        onClick={() =>
          effectiveConfirmWithDialog ? setOpen(true) : handleConfirm()
        }
        disabled={processing}
        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${buttonColor} ${className}`}
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <ButtonIcon className="w-4 h-4" />
            {buttonLabel}
          </>
        )}
      </button>

      {/* Dialog xác nhận (nếu bật) */}
      {effectiveConfirmWithDialog && open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-5 border-b border-slate-200 bg-slate-50">
              <div
                className={`${
                  mode === "ship" ? "bg-purple-600" : "bg-blue-600"
                } p-2.5 rounded-lg`}
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3
                  id="confirm-title"
                  className="text-base font-bold text-slate-900"
                >
                  {mode === "ship"
                    ? "Xác nhận thanh toán vận chuyển"
                    : "Xác nhận thanh toán"}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800 font-medium">
                  Bạn có chắc chắn muốn xác nhận thanh toán cho đơn hàng này
                  không?
                </p>
              </div>

              {order && (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-medium text-slate-600">
                        Mã đơn hàng
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {order?.orderCode ?? order?.code ?? "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">
                          {mode === "ship"
                            ? "Mã giao dịch ship"
                            : "Mã giao dịch"}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          mode === "ship" ? "text-purple-600" : "text-blue-600"
                        }`}
                      >
                        {mode === "ship"
                          ? paymentCodeShip ?? "—"
                          : paymentCodeOrder ?? "—"}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-medium text-slate-600">
                          Khách hàng
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 truncate block">
                        {order?.customer?.name || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`${
                      mode === "ship"
                        ? "bg-purple-600 border-purple-500"
                        : "bg-blue-600 border-blue-500"
                    } rounded-lg p-4 border-2 shadow-lg`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckIcon className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-blue-100">
                        Số tiền thanh toán
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(amount)} đ
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setOpen(false)}
                disabled={processing}
                className="flex-1 px-4 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors font-semibold text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirm}
                disabled={processing}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg transition-colors font-semibold text-sm shadow-md
                ${
                  mode === "ship"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <CheckIcon className="w-4 h-4" />
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmPayment;
