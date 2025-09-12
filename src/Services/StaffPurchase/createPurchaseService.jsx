import api from "../../config/api.js";

const createPurchaseService = {
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
};

export default createPurchaseService;
