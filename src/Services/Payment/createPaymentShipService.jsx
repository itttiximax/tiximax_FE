// src/Services/SharedService/createPaymentShipService.jsx
import api from "../../config/api.js";

const createPaymentShipService = {
  /**
   * Tạo thanh toán gộp cho các đơn hàng vận chuyển
   * @param {string[]} orderIds - Mảng các mã đơn hàng (VD: ["MH-701360", "MH-701361"])
   * @param {string} token - Bearer token cho Authorization
   * @returns {Promise<Object>} - Dữ liệu thanh toán được tạo
   */
  createMergedShippingPayment: async (orderIds, token) => {
    // Validation
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      throw new Error("Order IDs array is required and must not be empty");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }

    try {
      const response = await api.post(`/payments/merged-shipping`, orderIds, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating merged shipping payment:", error);
      throw error;
    }
  },
};

export default createPaymentShipService;
