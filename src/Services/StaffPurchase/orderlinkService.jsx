import api from "../../config/api.js";

const orderlinkService = {
  getOrdersWithLinks: async (page = 0, size = 15, orderType = null) => {
    let url = `/orders/with-links/${page}/${size}`;
    if (orderType) url += `?orderType=${orderType}`;

    const res = await api.get(url);
    return res.data;
  },

  getOrderWithLinksById: async (orderId) => {
    const res = await api.get(`/orders/with-links/${orderId}`);
    return res.data;
  },

  getOrderLinkById: async (linkId) => {
    const res = await api.get(`/orders/orderLink/${linkId}`);
    return res.data;
  },

  getPurchasesShipmentCode: async (page = 0, size = 10, status = null) => {
    const params = {};
    if (status) {
      params.status = status;
    }

    const res = await api.get(`/purchases/lack-shipment-code/${page}/${size}`, {
      params,
    });
    return res.data;
  },

  updatePurchaseShipmentAddress: async (purchaseId, data) => {
    const res = await api.put(`/purchases/shipment/${purchaseId}`, data);
    return res.data;
  },
  getAllPurchases: async (page = 0, size = 10, filter = "") => {
    let url = `/purchases/all-purchase/${page}/${size}`;
    if (filter) {
      url += `?filter=${filter}`;
    }
    const res = await api.get(url);
    return res.data;
  },

  updateShipmentCodeAndFee: async (purchaseId, shipmentCode, shipFee) => {
    const res = await api.put(`/purchases/shipment-ship-fee/${purchaseId}`, {
      shipmentCode,
      shipFee,
    });
    return res.data;
  },
};

export default orderlinkService;
