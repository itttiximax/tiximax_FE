// src/Services/StaffPurchase/createPurchaseService.js
import api from "../../config/api.js";

const createPurchaseService = {
  // Create purchase for MUA_HO (Mua hộ)
  createPurchase: async (orderCode, data) => {
    // Input validation
    if (!orderCode) {
      throw new Error("Order code is required");
    }

    if (!data) {
      throw new Error("Purchase data is required");
    }

    try {
      const response = await api.post(
        `/purchases/add?orderCode=${orderCode}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating purchase:", error);
      throw error;
    }
  },

  // Create purchase for DAU_GIA (Đấu giá)
  createAuctionPurchase: async (orderCode, data) => {
    // Input validation
    if (!orderCode) {
      throw new Error("Order code is required");
    }

    if (!data) {
      throw new Error("Purchase data is required");
    }

    try {
      const response = await api.post(
        `/purchases/auction/add?orderCode=${orderCode}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating auction purchase:", error);
      throw error;
    }
  },

  // Cancel order link
  cancelOrderLink: async (orderId, linkId) => {
    // Input validation
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!linkId) {
      throw new Error("Link ID is required");
    }

    try {
      const response = await api.put(
        `/orders/order-link/cancel/${orderId}/${linkId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling order link:", error);
      throw error;
    }
  },
};

export default createPurchaseService;
