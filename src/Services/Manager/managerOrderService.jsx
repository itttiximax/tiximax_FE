import api from "../../config/api.js";

const managerOrderService = {
  // Get orders with pagination (API uses 0-based indexing)
  getOrdersPaging: async (page = 0, size = 20) => {
    try {
      // Input validation
      if (page < 0) {
        throw new Error("Page number must be greater than or equal to 0");
      }
      if (!size || size < 1) {
        throw new Error("Page size must be greater than 0");
      }

      const response = await api.get(`/orders/${page}/${size}/paging`, {
        params: {
          size: size,
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching orders with pagination (page: ${page}, size: ${size}):`,
        error.response || error
      );
      throw error;
    }
  },

  // Get all orders (without pagination)
  getAllOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error.response || error);
      throw error;
    }
  },
};

// Export both object and backward compatibility functions
export default managerOrderService;

// BACKWARD COMPATIBILITY: giữ function cũ để không break existing code
export const getOrdersPaging = managerOrderService.getOrdersPaging;
export const getAllOrders = managerOrderService.getAllOrders;
