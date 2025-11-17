// import api from "../../config/api.js";

// const orderService = {
//   // Create order

//   createOrder: async (customerCode, routeId, addressId, orderData) => {
//     if (!customerCode) throw new Error("Customer code is required");
//     if (!routeId) throw new Error("Route ID is required");
//     if (!addressId) throw new Error("Address ID is required");
//     if (!orderData) throw new Error("Payload is required");

//     const url = `/orders/${encodeURIComponent(customerCode)}/${Number(
//       routeId
//     )}/${Number(addressId)}`;
//     const res = await api.post(url, orderData);
//     return res.data;
//   },
//   // Get order by ID
//   getOrder: async (orderId) => {
//     try {
//       if (!orderId) {
//         throw new Error("Order ID is required");
//       }

//       const response = await api.get(`/orders/${orderId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching order ${orderId}:`, error);
//       throw error;
//     }
//   },

//   // Get all orders
//   getOrders: async () => {
//     try {
//       const response = await api.get("/orders");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       throw error;
//     }
//   },

//   // Get orders by customer
//   getOrdersByCustomer: async (customerCode) => {
//     try {
//       if (!customerCode) {
//         throw new Error("Customer code is required");
//       }

//       const response = await api.get(`/orders/customer/${customerCode}`);
//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error fetching orders for customer ${customerCode}:`,
//         error
//       );
//       throw error;
//     }
//   },

//   // Update order status
//   updateOrderStatus: async (orderId, status) => {
//     try {
//       if (!orderId) {
//         throw new Error("Order ID is required");
//       }
//       if (!status) {
//         throw new Error("Order status is required");
//       }

//       const response = await api.put(`/orders/${orderId}/status`, {
//         status: status,
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Error updating order status for ${orderId}:`, error);
//       throw error;
//     }
//   },

//   // Cancel order
//   cancelOrder: async (orderId) => {
//     try {
//       if (!orderId) {
//         throw new Error("Order ID is required");
//       }

//       const response = await api.delete(`/orders/${orderId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error canceling order ${orderId}:`, error);
//       throw error;
//     }
//   },

//   // Get refund orders with pagination
//   getRefundOrders: async (offset = 0, limit = 10) => {
//     try {
//       // Validate parameters
//       if (offset < 0) {
//         throw new Error("Offset must be non-negative");
//       }
//       if (limit <= 0) {
//         throw new Error("Limit must be positive");
//       }

//       const response = await api.get(`/orders/refund/${offset}/${limit}`);
//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error fetching refund orders (offset: ${offset}, limit: ${limit}):`,
//         error
//       );
//       throw error;
//     }
//   },
//   // Confirm refund (with refundToCustomer true/false)
//   confirmRefundOrder: async (orderId, refundToCustomer) => {
//     try {
//       if (!orderId) {
//         throw new Error("Order ID is required for refund confirmation");
//       }

//       if (refundToCustomer === undefined) {
//         throw new Error("refundToCustomer must be true or false");
//       }

//       const response = await api.put(
//         `/orders/refund-confirm/${orderId}?refundToCustomer=${refundToCustomer}`
//       );

//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error confirming refund for order ${orderId} (refundToCustomer: ${refundToCustomer}):`,
//         error
//       );
//       throw error;
//     }
//   },
// };
// export default orderService;

// export const createOrderService = orderService.createOrder;

import api from "../../config/api.js";

const orderService = {
  createOrder: async (customerCode, routeId, addressId, orderData) => {
    const url = `/orders/${encodeURIComponent(customerCode)}/${Number(
      routeId
    )}/${Number(addressId)}`;
    const res = await api.post(url, orderData);
    return res.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  getOrdersByCustomer: async (customerCode) => {
    const response = await api.get(`/orders/customer/${customerCode}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  getRefundOrders: async (offset = 0, limit = 10) => {
    const response = await api.get(`/orders/refund/${offset}/${limit}`);
    return response.data;
  },

  confirmRefundOrder: async (orderId, refundToCustomer) => {
    const response = await api.put(
      `/orders/refund-confirm/${orderId}?refundToCustomer=${refundToCustomer}`
    );
    return response.data;
  },
};

export default orderService;
export const createOrderService = orderService.createOrder;
