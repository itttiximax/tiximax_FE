import api from "../../config/api.js";

const orderlinkService = {
  // Get orders with links (paginated) - with orderType filter
  getOrdersWithLinks: async (page = 0, size = 15, orderType = null) => {
    // Input validation
    if (typeof page !== "number" || page < 0) {
      throw new Error("Page must be a non-negative number");
    }

    if (typeof size !== "number" || size <= 0 || size > 100) {
      throw new Error(
        "Size must be a positive number and less than or equal to 100"
      );
    }

    // Validate orderType if provided
    const validOrderTypes = ["MUA_HO", "DAU_GIA", "KY_GUI"];
    if (orderType && !validOrderTypes.includes(orderType)) {
      throw new Error(
        `Invalid orderType. Must be one of: ${validOrderTypes.join(", ")}`
      );
    }

    // Build URL with query parameters
    let url = `/orders/with-links/${page}/${size}`;

    // Add orderType as query parameter if provided
    if (orderType) {
      url += `?orderType=${orderType}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  // Get order with links by ID
  getOrderWithLinksById: async (orderId) => {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (typeof orderId !== "number" && typeof orderId !== "string") {
      throw new Error("Order ID must be a number or string");
    }

    const response = await api.get(`/orders/with-links/${orderId}`);
    return response.data;
  },

  // Get order link by ID
  getOrderLinkById: async (linkId) => {
    if (!linkId) {
      throw new Error("Link ID is required");
    }

    if (typeof linkId !== "number" && typeof linkId !== "string") {
      throw new Error("Link ID must be a number or string");
    }

    const response = await api.get(`/orders/orderLink/${linkId}`);
    return response.data;
  },
  // Get purchases thiếu mã vận đơn (lack shipment code)
  getPurchasesLackShipmentCode: async (page = 0, size = 10) => {
    if (typeof page !== "number" || page < 0) {
      throw new Error("Page must be a non-negative number");
    }
    if (typeof size !== "number" || size <= 0 || size > 100) {
      throw new Error(
        "Size must be a positive number and less than or equal to 100"
      );
    }

    const response = await api.get(
      `/purchases/lack-shipment-code/${page}/${size}`
    );
    return response.data;
  },
  updatePurchaseShipmentAddress: async (purchaseId, address) => {
    if (!purchaseId) throw new Error("purchaseId required");
    if (!address?.trim()) throw new Error("address required");

    const res = await api.put(
      `/purchases/shipment/${purchaseId}`,
      JSON.stringify(address)
    );
    return res.data;
  },
};

export default orderlinkService;
