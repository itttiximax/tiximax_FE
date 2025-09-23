// packingsService.jsx
import api from "../../config/api";

class PackingsService {
  // Get eligible orders for packing with pagination
  async getEligibleOrders(page = 0, limit = 10) {
    try {
      const response = await api.get(
        `/packings/eligible-orders/${page}/${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching eligible orders:", error);
      throw error;
    }
  }

  // Get all eligible orders (fetch all pages)
  async getAllEligibleOrders(limit = 10) {
    const allOrders = [];
    let currentPage = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await this.getEligibleOrders(currentPage, limit);

        if (response.data && response.data.length > 0) {
          allOrders.push(...response.data);
          currentPage++;
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMoreData = false;
      }
    }

    return allOrders;
  }
}

// Create and export a singleton instance
const packingsService = new PackingsService();

export default packingsService;
