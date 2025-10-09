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
};

export default performanceService;
