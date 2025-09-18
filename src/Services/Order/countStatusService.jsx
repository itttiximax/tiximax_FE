// src/Services/SharedService/countStatusService.jsx

import api from "../../config/api.js";

const countStatusService = {
  // Get order statistics for payment
  getForPaymentStatistics: async () => {
    try {
      const response = await api.get("/orders/statistics/for-payment");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching payment statistics:",
        error.response || error
      );
      throw error;
    }
  },

  // (Optional) If bạn muốn lọc theo status hoặc tham số nào đó
  getForPaymentStatisticsWithParams: async (params) => {
    try {
      if (!params || typeof params !== "object") {
        throw new Error("Params must be an object");
      }
      const response = await api.get("/orders/statistics/for-payment", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching payment statistics with params:",
        error.response || error
      );
      throw error;
    }
  },
};

export default countStatusService;

// BACKWARD COMPATIBILITY
export const getForPaymentStatistics =
  countStatusService.getForPaymentStatistics;
export const getForPaymentStatisticsWithParams =
  countStatusService.getForPaymentStatisticsWithParams;
