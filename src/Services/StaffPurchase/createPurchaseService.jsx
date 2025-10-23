// src/Services/StaffPurchase/createPurchaseService.js
import api from "../../config/api.js";

const createPurchaseService = {
  // Create purchase for MUA_HO (Mua hộ)
  createPurchase: async (orderCode, data) => {
    if (!orderCode) throw new Error("Order code is required");
    if (!data) throw new Error("Purchase data is required");

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
    if (!orderCode) throw new Error("Order code is required");
    if (!data) throw new Error("Purchase data is required");

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

  // Cancel 1 link trong đơn
  cancelOrderLink: async (orderId, linkId) => {
    if (!orderId) throw new Error("Order ID is required");
    if (!linkId) throw new Error("Link ID is required");

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

  // Đánh dấu 1 link "Mua sau"
  markBuyLaterForLink: async (orderId, linkId) => {
    if (!orderId) throw new Error("Order ID is required");
    if (!linkId) throw new Error("Link ID is required");

    try {
      const response = await api.put(
        `/orders/buy-later/${orderId}/links/${linkId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking link as buy later:", error);
      throw error;
    }
  },

  // Ghim / bỏ ghim đơn hàng
  // Usage: await createPurchaseService.pinOrder(8, true)  // ghim
  //        await createPurchaseService.pinOrder(8, false) // bỏ ghim
  pinOrder: async (orderId, pin = true) => {
    if (!orderId) throw new Error("Order ID is required");

    try {
      const response = await api.put(`/orders/pin/${orderId}?pin=${pin}`);
      return response.data;
    } catch (error) {
      console.error("Error pinning order:", error);
      throw error;
    }
  },
};

export default createPurchaseService;
