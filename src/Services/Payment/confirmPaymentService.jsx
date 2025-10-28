import api from "../../config/api.js";

const confirmPaymentService = {
  /**
   * Xác nhận thanh toán theo paymentId.
   * JWT sẽ tự động được gắn qua axios interceptor.
   * @param {string|number} paymentId
   * @returns {Promise<any>}
   */
  confirmPayment: async (paymentId) => {
    try {
      // Kiểm tra đầu vào
      if (!paymentId) throw new Error("Payment ID is required");
      if (typeof paymentId !== "string" && typeof paymentId !== "number") {
        throw new Error("Payment ID must be a string or number");
      }

      // Gửi PUT request — không cần body, JWT đã gắn tự động
      const response = await api.put(
        `/payments/confirm/${encodeURIComponent(paymentId)}`,
        {},
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error confirming payment:", error?.response || error);
      throw error;
    }
  },

  // Confirm shipping payment by paymentCode
  confirmShippingPayment: async (paymentCode, token) => {
    try {
      // Input validation
      if (!paymentCode) {
        throw new Error("Payment code is required");
      }
      if (typeof paymentCode !== "string") {
        throw new Error("Payment code must be a string");
      }
      if (!token) {
        throw new Error("Authorization token is required");
      }

      const response = await api.put(
        `/payments/confirm-shipping/${paymentCode}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error confirming shipping payment:",
        error.response || error
      );
      throw error;
    }
  },
};

// Export default service
export default confirmPaymentService;

// BACKWARD COMPATIBILITY
export const confirmPayment = confirmPaymentService.confirmPayment;
export const confirmShippingPayment =
  confirmPaymentService.confirmShippingPayment;
