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
  // Get warehouse link orders by status with pagination and filters
  async getWarehouseLinkOrders(page = 0, limit = 20, filters = {}) {
    try {
      const params = {};

      // Add status filter (default: DA_NHAP_KHO_VN)
      if (filters.status) {
        params.status = filters.status;
      }

      // Add shipmentCode filter if provided
      if (filters.shipmentCode) {
        params.shipmentCode = filters.shipmentCode;
      }

      // Add customerCode filter if provided
      if (filters.customerCode) {
        params.customerCode = filters.customerCode;
      }

      const response = await api.get(
        `/orders/warehouse-links/${page}/${limit}`,
        { params }
      );

      if (response.data?.error) {
        throw new Error(`API Error: ${response.data.error}`);
      }

      // Handle response structure (might be paginated or array)
      if (response.data?.content) {
        return response.data;
      }

      return {
        content: Array.isArray(response.data) ? response.data : [],
        totalElements:
          response.data?.totalElements ||
          (Array.isArray(response.data) ? response.data.length : 0),
        totalPages: response.data?.totalPages || 1,
        currentPage: page,
        size: limit,
      };
    } catch (error) {
      console.error(`Error fetching warehouse link orders:`, error);
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
  // Transfer domestic orders to customer
  async transferToCustomer() {
    try {
      const response = await api.post("/domestics/transfer-to-customer");
      if (response.data && response.data.error) {
        throw new Error(`API Error: ${response.data.error}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error transferring domestic orders to customer:", error);
      throw error;
    }
  }
  // Chuyển đơn nội địa cho từng khách cụ thể (VD: KH-5F37E1)
  async transferByCustomer(customerCode) {
    const { data } = await api.post(
      `/domestics/transfer-by-customer/${customerCode}`
    );

    if (data?.error) {
      throw new Error(`API Error: ${data.error}`);
    }

    return data;
  }
}

// Create and export a singleton instance
const domesticService = new DomesticService();

export default domesticService;
