// src/Components/Payment/ConfirmPaymentShip.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, CheckCircle, Truck } from "lucide-react";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";

const ConfirmPaymentShip = ({ paymentCode, orderCode, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    // Validate paymentCode
    if (!paymentCode || !paymentCode.trim()) {
      toast.error("Mã thanh toán không hợp lệ");
      return;
    }

    // Validate token
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Vui lòng đăng nhập để xác nhận thanh toán");
      return;
    }

    setLoading(true);

    try {
      const result = await confirmPaymentService.confirmShippingPayment(
        paymentCode,
        token
      );

      // Success message từ backend
      const successMessage =
        result?.message ||
        result?.data?.message ||
        `Xác nhận thanh toán ship thành công${
          orderCode ? ` cho đơn ${orderCode}` : ""
        }!`;

      toast.success(successMessage, {
        duration: 3000,
        style: {
          background: "#3bbd2aff",
          color: "#065F46",
          border: "1px solid #fafafaff",
        },
      });

      onSuccess?.(result);
    } catch (error) {
      console.error("Error confirming shipping payment:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Không thể xác nhận thanh toán vận chuyển";

      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: "#fcfcfcff",
          color: "#f14040ff",
          border: "1px solid #FCA5A5",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConfirmPayment}
      disabled={loading || !paymentCode}
      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          <Truck className="w-4 h-4" />
          Xác nhận thanh toán ship
        </>
      )}
    </button>
  );
};

export default ConfirmPaymentShip;
