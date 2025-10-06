import api from "../../config/api.js";

const orderDepositService = {
  // Create deposit order
  createDepositOrder: async (customerCode, routeId, orderData, token) => {
    try {
      // Input validation
      if (!customerCode) {
        throw new Error("Customer code is required");
      }
      if (!routeId) {
        throw new Error("Route ID is required");
      }
      if (typeof routeId !== "number" || routeId <= 0) {
        throw new Error("Route ID must be a positive number");
      }
      if (!orderData) {
        throw new Error("Order data is required");
      }
      if (!token) {
        throw new Error("Authorization token is required");
      }

      // Validate orderData structure
      if (!orderData.orderType) {
        throw new Error("Order type is required");
      }
      if (!orderData.destinationId) {
        throw new Error("Destination ID is required");
      }
      if (
        !orderData.consignmentLinkRequests ||
        !Array.isArray(orderData.consignmentLinkRequests)
      ) {
        throw new Error("Consignment link requests must be an array");
      }

      const response = await api.post(
        `/orders/deposit/${customerCode}/${routeId}`, // ✅ FIXED: Changed from depositAmount to routeId
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating deposit order:", error.response || error);
      throw error;
    }
  },

  // Create deposit order with multiple consignments
  createDepositOrderBulk: async (
    customerCode,
    routeId,
    orderType,
    destinationId,
    checkRequired,
    consignmentLinkRequests,
    token
  ) => {
    try {
      // Build order data
      const orderData = {
        orderType,
        destinationId,
        checkRequired: checkRequired ?? false,
        consignmentLinkRequests,
      };

      return await orderDepositService.createDepositOrder(
        customerCode,
        routeId, // ✅ FIXED: Changed from depositAmount to routeId
        orderData,
        token
      );
    } catch (error) {
      console.error("Error creating bulk deposit order:", error);
      throw error;
    }
  },
};

// Export default service
export default orderDepositService;

// BACKWARD COMPATIBILITY
export const createDepositOrder = orderDepositService.createDepositOrder;
export const createDepositOrderBulk =
  orderDepositService.createDepositOrderBulk;
