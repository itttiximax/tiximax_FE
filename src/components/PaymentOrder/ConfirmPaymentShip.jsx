import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";

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

const ConfirmPaymentShip = ({ paymentCode, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để xác nhận thanh toán");
        return;
      }

      await confirmPaymentService.confirmShippingPayment(paymentCode, token);

      toast.success("Xác nhận thanh toán thành công");

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể xác nhận thanh toán: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConfirmPayment}
      disabled={loading}
      className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" />
          Đang xác nhận...
        </>
      ) : (
        "Xác nhận thanh toán"
      )}
    </button>
  );
};

export default ConfirmPaymentShip;
