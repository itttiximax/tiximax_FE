// src/Services/SharedService/orderlinkService.jsx
import api from "../../config/api.js";

const orderlinkService = {
  // Get orders with links (paginated)
  getOrdersWithLinks: async (page = 0, size = 10) => {
    // Input validation
    if (typeof page !== "number" || page < 0) {
      throw new Error("Page must be a non-negative number");
    }

    if (typeof size !== "number" || size <= 0 || size > 100) {
      throw new Error(
        "Size must be a positive number and less than or equal to 100"
      );
    }

    const response = await api.get(`/orders/with-links/${page}/${size}`);
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
};

export default orderlinkService;
