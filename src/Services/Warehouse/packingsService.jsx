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

  // Get awaiting-flight orders with pagination
  async getAwaitingFlightOrders(page = 0, limit = 10) {
    try {
      const response = await api.get(
        `/packings/awaiting-flight/${page}/${limit}`
      );
      if (response.data && response.data.error) {
        throw new Error(`API Error: ${response.data.error}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching awaiting-flight orders:", error);
      throw error;
    }
  }

  // Get all awaiting-flight orders (fetch all pages)
  async getAllAwaitingFlightOrders(limit = 10) {
    const allOrders = [];
    let currentPage = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await this.getAwaitingFlightOrders(currentPage, limit);
        if (response && response.length > 0) {
          allOrders.push(...response);
          currentPage++;
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error(
          `Error fetching awaiting-flight page ${currentPage}:`,
          error
        );
        hasMoreData = false;
      }
    }

    return allOrders;
  }

  // Assign a flight to multiple packings
  async assignFlight(packingIds, flightCode) {
    try {
      const response = await api.put("/packings/assign-flight", {
        packingIds,
        flightCode,
      });
      if (response.data && response.data.error) {
        throw new Error(`API Error: ${response.data.error}`);
      }
      return response.data; // Giả sử trả về thông tin thành công hoặc packings đã cập nhật
    } catch (error) {
      console.error(
        `Error assigning flight to packings ${packingIds.join(", ")}:`,
        error
      );
      throw error;
    }
  }
  // Get flying-away orders with pagination
  async getFlyingAwayOrders(page = 0, limit = 10) {
    try {
      const response = await api.get(`/packings/flying-away/${page}/${limit}`);
      if (response.data && response.data.error) {
        throw new Error(`API Error: ${response.data.error}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching flying-away orders:", error);
      throw error;
    }
  }

  // Get all flying-away orders (fetch all pages)
  async getAllFlyingAwayOrders(limit = 10) {
    const allOrders = [];
    let currentPage = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      try {
        const response = await this.getFlyingAwayOrders(currentPage, limit);
        if (response && response.length > 0) {
          allOrders.push(...response);
          currentPage++;
        } else {
          hasMoreData = false;
        }
      } catch (error) {
        console.error(`Error fetching flying-away page ${currentPage}:`, error);
        hasMoreData = false;
      }
    }

    return allOrders;
  }

  async getPackingById(packingId) {
    const { data } = await api.get(
      `/packings/${encodeURIComponent(packingId)}`
    );
    return data;
  }

  async removeShipments(packingCode, shipmentCodes) {
    if (
      !packingCode ||
      !Array.isArray(shipmentCodes) ||
      shipmentCodes.length === 0
    ) {
      throw new Error("packingCode và shipmentCodes không được để trống");
    }

    const endpoint = `/packings/packing/${encodeURIComponent(
      packingCode
    )}/remove-shipments`;
    const response = await api.patch(endpoint, shipmentCodes);
    return response.data;
  }

  async exportPackings(packingIds) {
    if (!Array.isArray(packingIds) || packingIds.length === 0) {
      throw new Error("packingIds không được để trống");
    }

    const queryString = packingIds.map((id) => `packingIds=${id}`).join("&");
    const { data } = await api.get(`/packings/export?${queryString}`);
    return data;
  }
  async getPackingWarehouses(packingId) {
    if (!packingId) {
      throw new Error("packingId không được để trống");
    }

    const { data } = await api.get(
      `/packings/${encodeURIComponent(packingId)}/warehouses`
    );
    return data;
  }
}

// Create and export a singleton instance
const packingsService = new PackingsService();

export default packingsService;
