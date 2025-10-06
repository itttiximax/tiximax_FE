import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Truck } from "lucide-react";
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

const CreateMergedPaymentShip = ({
  selectedOrders,
  selectedCount,
  totalAmount,
  onSuccess,
  formatCurrency,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCreateMergedPayment = async () => {
    if (!selectedOrders || selectedOrders.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 đơn hàng vận chuyển để thanh toán");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để thực hiện thanh toán");
        return;
      }

      const result = await createPaymentShipService.createMergedShippingPayment(
        selectedOrders,
        token
      );

      toast.success(
        `Tạo thanh toán vận chuyển gộp thành công! Mã thanh toán: ${result.paymentCode}`
      );

      // Call onSuccess callback with payment data
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Error creating merged shipping payment:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(`Không thể tạo thanh toán vận chuyển gộp: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {selectedCount > 0 && (
        <>
          <span className="text-sm text-gray-600">
            Đã chọn: {selectedCount} đơn hàng
          </span>
          <span className="text-sm font-medium text-gray-900">
            Tổng: {formatCurrency(totalAmount)}
          </span>
        </>
      )}
      <button
        onClick={handleCreateMergedPayment}
        disabled={loading || selectedCount === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Đang tạo...
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 mr-2" />
            Tạo thanh toán ship gộp
          </>
        )}
      </button>
    </div>
  );
};

export default CreateMergedPaymentShip;
