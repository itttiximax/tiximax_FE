import api from "../../config/api.js";

const confirmPaymentService = {
  // Confirm payment by paymentId
  confirmPayment: async (paymentId, token) => {
    try {
      // Input validation
      if (!paymentId) {
        throw new Error("Payment ID is required");
      }
      if (typeof paymentId !== "string" && typeof paymentId !== "number") {
        throw new Error("Payment ID must be a string or number");
      }
      if (!token) {
        throw new Error("Authorization token is required");
      }

      const response = await api.put(
        `/payments/confirm/${paymentId}`,
        {}, // Empty body, as in your curl command
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error confirming payment:", error.response || error);
      throw error;
    }
  },
};

// Export default service
export default confirmPaymentService;

// BACKWARD COMPATIBILITY
export const confirmPayment = confirmPaymentService.confirmPayment;
