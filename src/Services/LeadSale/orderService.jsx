import api from "../../config/api.js"; // ← THAY ĐỔI: import api thay vì axios

const orderService = {
  // Create order
  createOrder: async (customerCode, routeId, orderData) => {
    // ← THAY ĐỔI: đổi thành method của object
    try {
      // Input validation
      if (!customerCode) {
        throw new Error("Customer code is required");
      }
      if (!routeId) {
        throw new Error("Route ID is required");
      }
      if (!orderData) {
        throw new Error("Order data is required");
      }

      // ← BỎ: token check và manual headers - api tự động xử lý
      const response = await api.post(
        `/orders/${customerCode}/${routeId}`,
        orderData
      );

      return response.data;
    } catch (error) {
      console.error("Error creating order:", error.response || error);
      throw error;
    }
  },

  // Get order by ID
  getOrder: async (orderId) => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Get all orders
  getOrders: async () => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get orders by customer
  getOrdersByCustomer: async (customerCode) => {
    try {
      if (!customerCode) {
        throw new Error("Customer code is required");
      }

      const response = await api.get(`/orders/customer/${customerCode}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching orders for customer ${customerCode}:`,
        error
      );
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }
      if (!status) {
        throw new Error("Order status is required");
      }

      const response = await api.put(`/orders/${orderId}/status`, {
        status: status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order status for ${orderId}:`, error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling order ${orderId}:`, error);
      throw error;
    }
  },
};

// Export both object and backward compatibility function
export default orderService;

// BACKWARD COMPATIBILITY: giữ function cũ để không break existing code
export const createOrderService = orderService.createOrder;
