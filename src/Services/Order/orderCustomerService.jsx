import api from "../../config/api.js";

const orderCustomerService = {
  // /**
  //  * Lấy danh sách đơn hàng theo customerId
  //  * @param {string} customerId - Mã khách hàng (VD: KH-84A2DB)
  //  * @param {string} token - Bearer token cho Authorization
  //  * @returns {Promise<Object>} - Dữ liệu đơn hàng
  //  */
  getOrdersByCustomer: async (customerId, token) => {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }

    try {
      const response = await api.get(
        `/orders/orders/by-customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by customer:", error);
      throw error;
    }
  },

  getPaymentAuctionByCustomer: async (customerId, token) => {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }
  if (!token) {
    throw new Error("Authorization token is required");
  }

  try {
    const response = await api.get(
      `/orders/payment-auction/by-customer/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    throw error;
  }
},

  // /**
  //  * Lấy danh sách đơn hàng đang vận chuyển theo customerId
  //  * @param {string} customerId - Mã khách hàng (VD: KH-84A2DB)
  //  * @param {string} token - Bearer token cho Authorization
  //  * @returns {Promise<Object>} - Dữ liệu đơn hàng đang vận chuyển
  //  */
  getOrdersShippingByCustomer: async (customerId, token) => {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }
    if (!token) {
      throw new Error("Authorization token is required");
    }

    try {
      const response = await api.get(
        `/orders/orders-shipping/by-customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching shipping orders by customer:", error);
      throw error;
    }
  },
  getPartialOrdersByCustomer: async (customerId, token) => {
    if (!customerId) throw new Error("Customer ID is required");
    if (!token) throw new Error("Authorization token is required");

    try {
      const response = await api.get(
        `/orders/partial-for-customer/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching partial orders by customer:", error);
      throw error;
    }
  },
};

export default orderCustomerService;
