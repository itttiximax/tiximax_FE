import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import createPaymentShipService from "../../Services/Payment/createPaymentShipService";

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

const CreatePaymentShip = ({ orderCode, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để thực hiện thanh toán");
        return;
      }

      const response =
        await createPaymentShipService.createMergedShippingPayment(
          [orderCode],
          token
        );

      toast.success("Tạo thanh toán thành công");

      // Call onSuccess callback with payment data
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể tạo thanh toán: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreatePayment}
      disabled={loading}
      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-4 w-4" />
          Đang tạo...
        </>
      ) : (
        "Tạo thanh toán"
      )}
    </button>
  );
};

export default CreatePaymentShip;
