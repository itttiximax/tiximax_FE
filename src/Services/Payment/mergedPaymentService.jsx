// src/Services/SharedService/mergedPaymentService.jsx
import api from "../../config/api.js";

const API_URL = "/payments/merged";

const mergedPaymentService = {
  // Tạo merged payment
  createMergedPayment: async (orderCodes, token) => {
    try {
      // Validate input
      if (
        !orderCodes ||
        !Array.isArray(orderCodes) ||
        orderCodes.length === 0
      ) {
        throw new Error("Order codes array is required and cannot be empty");
      }

      // Filter out empty/null values
      const validOrderCodes = orderCodes.filter(
        (code) => code && typeof code === "string" && code.trim() !== ""
      );

      if (validOrderCodes.length === 0) {
        throw new Error("At least one valid order code is required");
      }

      console.log("Creating merged payment for order codes:", validOrderCodes);

      const response = await api.post(API_URL, validOrderCodes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Merged payment created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating merged payment:", error);
      throw error;
    }
  },
};

export default mergedPaymentService;
