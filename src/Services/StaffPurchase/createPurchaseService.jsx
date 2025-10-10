// src/Services/StaffPurchase/createPurchaseService.js
import api from "../../config/api.js";

const createPurchaseService = {
  // Create purchase for MUA_HO (Mua hộ)
  createPurchase: async (orderCode, data, token) => {
    // Input validation
    if (!orderCode) {
      throw new Error("Order code is required");
    }

    if (!data) {
      throw new Error("Purchase data is required");
    }

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await api.post(
      `/purchases/add?orderCode=${orderCode}`,
      data,
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Handle non-2xx status codes
    const errorMessage =
      response.data?.message || response.statusText || "Unknown error";
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.data = response.data;
    throw error;
  },

  // Create purchase for DAU_GIA (Đấu giá)
  createAuctionPurchase: async (orderCode, data, token) => {
    // Input validation
    if (!orderCode) {
      throw new Error("Order code is required");
    }

    if (!data) {
      throw new Error("Purchase data is required");
    }

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await api.post(
      `/purchases/auction/add?orderCode=${orderCode}`,
      data,
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Handle non-2xx status codes
    const errorMessage =
      response.data?.message || response.statusText || "Unknown error";
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.data = response.data;
    throw error;
  },

  // ✅ NEW: Cancel order link
  cancelOrderLink: async (orderId, linkId, token) => {
    // Input validation
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!linkId) {
      throw new Error("Link ID is required");
    }

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await api.put(
      `/orders/order-link/cancel/${orderId}/${linkId}`,
      null, // PUT request with no body
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Handle non-2xx status codes
    const errorMessage =
      response.data?.message || response.statusText || "Unknown error";
    const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
    error.status = response.status;
    error.data = response.data;
    throw error;
  },
};

export default createPurchaseService;
