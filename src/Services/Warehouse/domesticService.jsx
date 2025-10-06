import api from "../../config/api";

class DomesticService {
  // Get domestic orders ready for delivery with pagination
  async getDomesticOrders(page = 0, limit = 10) {
    try {
      const response = await api.get(
        `/domestics/ready-for-delivery/${page}/${limit}`
      );
      if (response.data && response.data.error) {
        throw new Error(`API Error: ${response.data.error}`);
      }
      // API returns array directly, wrap it in content structure
      return {
        content: Array.isArray(response.data) ? response.data : [],
        totalElements: Array.isArray(response.data) ? response.data.length : 0,
      };
    } catch (error) {
      console.error(
        "Error fetching domestic ready-for-delivery orders:",
        error
      );
      throw error;
    }
  }

  // Get all domestic orders (fetch all pages)
  async getAllDomesticOrders(limit = 10) {
    const allOrders = [];
    let currentPage = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await this.getDomesticOrders(currentPage, limit);
        if (response.content && response.content.length > 0) {
          allOrders.push(...response.content);
          currentPage++;
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error(
          `Error fetching domestic orders page ${currentPage}:`,
          error
        );
        hasMoreData = false;
      }
    }

    return allOrders;
  }
}

// Create and export a singleton instance
const domesticService = new DomesticService();

export default domesticService;
