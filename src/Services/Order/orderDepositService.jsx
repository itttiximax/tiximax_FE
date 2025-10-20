import api from "../../config/api.js";

const orderDepositService = {
  // Create deposit order
  createDepositOrder: async (customerCode, routeId, orderData) => {
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

      // ✅ FIXED: Không truyền token, để api interceptor xử lý
      const response = await api.post(
        `/orders/deposit/${customerCode}/${routeId}`,
        orderData
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
    consignmentLinkRequests
  ) => {
    try {
      // Build order data
      const orderData = {
        orderType,
        destinationId,
        checkRequired: checkRequired ?? false,
        consignmentLinkRequests,
      };

      // ✅ FIXED: Bỏ token parameter
      return await orderDepositService.createDepositOrder(
        customerCode,
        routeId,
        orderData
      );
    } catch (error) {
      console.error("Error creating bulk deposit order:", error);
      throw error;
    }
  },
};

export default orderDepositService;

// Backward compatibility
export const createDepositOrder = orderDepositService.createDepositOrder;
export const createDepositOrderBulk =
  orderDepositService.createDepositOrderBulk;
