// src/Components/Payment/ConfirmPaymentOrder.jsx
import confirmPaymentService from "../../Services/Payment/confirmPaymentService";

/**
 * Gọi API xác nhận thanh toán cho đơn hàng.
 * JWT đã được tự động gắn qua axios interceptor (config/api.js).
 * @param {string|number} paymentCode
 * @returns {Promise<{ success: boolean, data?: any, message?: string }>}
 */
export async function confirmPaymentOrder({ paymentCode }) {
  if (!paymentCode) {
    return { success: false, message: "Thiếu mã thanh toán (paymentCode)" };
  }

  try {
    const res = await confirmPaymentService.confirmPayment(paymentCode);
    return { success: true, data: res };
  } catch (error) {
    // Chuẩn hóa lỗi
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

export default null;
