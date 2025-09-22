import api from "../../config/api";

const warehouseService = {
  /**
   * Get ready warehouses with pagination
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 20)
   * @returns {Promise} API response
   */
  getReadyWarehouses: async (page = 0, size = 20) => {
    try {
      const response = await api.get(
        `/warehouse/${page}/${size}/ready-warehouses?size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching ready warehouses:", error);
      throw error;
    }
  },
};

export default warehouseService;
