// src/components/Refund/ConfirmRefundOrder.jsx
import React, { useEffect, useCallback, useState } from "react";
import { X, AlertTriangle, Loader2, CheckCircle2, Ban } from "lucide-react";
import orderService from "../../Services/LeadSale/orderService";
import toast from "react-hot-toast";

const ConfirmRefundOrder = ({ open, order, onClose, onSuccess }) => {
  const [refundToCustomer, setRefundToCustomer] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose?.();
    },
    [open, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // reset state khi mở modal mới
    if (open) {
      setRefundToCustomer(true);
      setSubmitting(false);
    }
  }, [open, order?.orderId]);

  const submit = async () => {
    if (!order?.orderId) return;
    try {
      setSubmitting(true);
      await orderService.confirmRefundOrder(order.orderId, refundToCustomer);
      toast.success(
        refundToCustomer
          ? "Đã xác nhận hoàn tiền về khách."
          : "Đã xác nhận hoàn tiền (không hoàn về khách)."
      );
      onClose?.();
      onSuccess?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Xác nhận hoàn tiền thất bại.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !submitting && onClose?.()}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Xác nhận hoàn tiền</h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="text-sm text-gray-600">
            Bạn đang xử lý hoàn tiền cho đơn{" "}
            <span className="font-semibold text-gray-900">
              {order?.orderCode || `#${order?.orderId}`}
            </span>
            .
          </div>

          {/* Switch / Radio chọn hình thức hoàn */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-800 mb-3">
              Chọn hình thức xử lý:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRefundToCustomer(true)}
                className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition
                ${
                  refundToCustomer
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                disabled={submitting}
              >
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Hoàn tiền về khách
                  </div>
                  <div className="text-xs text-gray-500">
                    Xác nhận và hoàn tiền trực tiếp cho khách hàng.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRefundToCustomer(false)}
                className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition
                ${
                  !refundToCustomer
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
                disabled={submitting}
              >
                <Ban className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Không hoàn về khách
                  </div>
                  <div className="text-xs text-gray-500">
                    Chỉ ghi nhận xử lý hoàn, không chuyển tiền cho khách.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Lưu ý */}
          <div className="text-xs text-gray-500">
            Thao tác này không thể hoàn tác. Vui lòng xác nhận chính xác hình
            thức xử lý.
          </div>
        </div>

        <div className="px-5 py-4 border-t flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Xác nhận</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRefundOrder;
