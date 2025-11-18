import api from "../../config/api.js"; // ← THAY ĐỔI: import api thay vì axios

const paymentService = {
  // Create payment
  createPayment: async (orderCode, paymentData = null) => {
    // ← THAY ĐỔI: đổi thành method của object
    try {
      if (!orderCode) {
        throw new Error("Order code is required");
      }

      // ← BỎ: token check và manual headers - api tự động xử lý
      const response = await api.post(
        `/payments/${orderCode}`,
        paymentData || {} // ← SỬA: dùng {} thay vì "" cho consistent
      );

      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error.response || error);
      throw error;
    }
  },

  // Get payment by order code
  getPayment: async (orderCode) => {
    try {
      if (!orderCode) {
        throw new Error("Order code is required");
      }

      const response = await api.get(`/payments/${orderCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment for order ${orderCode}:`, error);
      throw error;
    }
  },

  // Get all payments
  getPayments: async () => {
    try {
      const response = await api.get("/payments");
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderCode, status) => {
    try {
      if (!orderCode) {
        throw new Error("Order code is required");
      }
      if (!status) {
        throw new Error("Payment status is required");
      }

      const response = await api.put(`/payments/${orderCode}/status`, {
        status: status,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating payment status for order ${orderCode}:`,
        error
      );
      throw error;
    }
  },

  // Cancel payment
  cancelPayment: async (orderCode) => {
    try {
      if (!orderCode) {
        throw new Error("Order code is required");
      }

      const response = await api.delete(`/payments/${orderCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling payment for order ${orderCode}:`, error);
      throw error;
    }
  },
  getPaymentByCode: async (paymentCode) => {
    try {
      if (!paymentCode) {
        throw new Error("Payment code is required");
      }

      // Ví dụ: /payments/code/MG-CCBE11
      const response = await api.get(`/payments/code/${paymentCode}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching payment for code ${paymentCode}:`,
        error.response || error
      );
      throw error;
    }
  },
};

// Export both object and backward compatibility function
export default paymentService;

// ← BACKWARD COMPATIBILITY: giữ function cũ để không break existing code
export const createPaymentService = paymentService.createPayment;
