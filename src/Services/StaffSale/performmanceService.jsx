// performanceService.jsx
import api from "../../config/api.js";

const performanceService = {
  // Hàm để lấy dữ liệu sales-in-route
  getSalesInRoute: async (start = 0, limit = 10) => {
    try {
      const response = await api.get(
        `/accounts/sales-in-route/${start}/${limit}`,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching sales in route:", error);
      throw error;
    }
  },
  getCurrentMonthPerformance: async () => {
    try {
      const response = await api.get(`/accounts/my-performance/current-month`, {
        headers: { Accept: "*/*" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy hiệu suất tháng hiện tại:", error);
      throw error;
    }
  },
};

export default performanceService;
