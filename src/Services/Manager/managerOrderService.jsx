// src/Services/Manager/managerOrderService.js
import api from "../../config/api.js";

const managerOrderService = {
  // Get orders with pagination and status filter
  getOrdersPaging: async (page = 0, size = 20, status = "CHO_XAC_NHAN") => {
    try {
      // Basic validation
      if (page < 0 || size < 1 || size > 100 || !status) {
        throw new Error("Invalid parameters");
      }

      const validStatuses = [
        "CHO_XAC_NHAN",
        "DA_XAC_NHAN",
        "CHO_THANH_TOAN",
        "CHO_MUA",
        "CHO_NHAP_KHO_VN",
        "CHO_NHAP_KHO_NN",
        "CHO_DONG_GOI",
        "CHO_THANH_TOAN_SHIP",
        "CHO_NHAP_KHO_HN",
        "CHO_NHAP_KHO_SG",
        "CHO_GIAO_HANG",
        "DA_GIAO_HANG",
      ];

      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      // Use the correct API format: /orders/{page}/{size}/{status}/paging?size={size}
      const response = await api.get(
        `/orders/${page}/${size}/${status}/paging?size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders:`, error);

      if (error.response?.status === 404) {
        throw new Error("API endpoint not found");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request parameters");
      } else if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },

  // Get order detail by ID
  getOrderDetail: async (orderId) => {
    try {
      // Validate order ID
      if (!orderId || isNaN(orderId) || orderId <= 0) {
        throw new Error("Invalid order ID");
      }

      const response = await api.get(`/orders/detail/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order detail for ID ${orderId}:`, error);

      if (error.response?.status === 404) {
        throw new Error("Order not found");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid order ID");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied");
      } else if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },

  // Get orders by specific status
  getOrdersByStatus: async (status, page = 0, size = 20) => {
    return await managerOrderService.getOrdersPaging(page, size, status);
  },

  // Status configuration
  getAvailableStatuses: () => [
    { key: "CHO_XAC_NHAN", label: "Chờ xác nhận", color: "gray" },
    { key: "DA_XAC_NHAN", label: "Đã xác nhận", color: "green" },
    { key: "CHO_THANH_TOAN", label: "Chờ thanh toán", color: "orange" },
    { key: "CHO_MUA", label: "Chờ mua", color: "blue" },
    { key: "CHO_NHAP_KHO_NN", label: "Chờ nhập kho NN", color: "slate" },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      color: "yellow",
    },
    { key: "CHO_DONG_GOI", label: "Chờ đóng gói", color: "purple" },
    { key: "CHO_NHAP_KHO_VN", label: "Chờ nhập kho VN", color: "indigo" },
    { key: "CHO_GIAO_HANG", label: "Chờ giao hàng", color: "teal" },
    { key: "DA_GIAO_HANG", label: "Đã giao hàng", color: "emerald" },
  ],
};

export default managerOrderService;
