// src/Services/Manager/managerOrderService.js
import api from "../../config/api.js";

const managerOrderService = {
  // Get orders with pagination and status filter
  getOrdersPaging: async (page = 0, size = 100, status = "DA_XAC_NHAN") => {
    try {
      // Basic validation
      if (page < 0 || size < 1 || size > 200 || !status) {
        throw new Error("Invalid parameters");
      }

      const validStatuses = [
        "CHO_XAC_NHAN",
        "DA_XAC_NHAN",
        "CHO_THANH_TOAN",
        "CHO_THANH_TOAN_DAU_GIA",
        "CHO_THANH_TOAN_SHIP",
        "CHO_MUA",
        "CHO_NHAP_KHO_NN",
        "CHO_DONG_GOI",
        "DANG_XU_LY",
        "DA_GIAO",
        "DA_HOAN_THANH",
        "DA_HUY",
      ];

      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      // Updated API format: /orders/{page}/{size}/{status}/paging?size={size}
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
  // Get all orders without pagination
  getOrdersPaginated: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/orders/${page}/${size}`);
      return {
        content: response.data.content || [],
        totalPages: response.data.totalPages || 1,
        totalElements: response.data.totalElements || 0,
        number: response.data.number || 0,
        size: response.data.size || size,
      };
    } catch (error) {
      console.error(`Error fetching orders page ${page}, size ${size}:`, error);
      if (error.response?.status === 404)
        throw new Error("API endpoint not found");
      if (error.response?.status === 403) throw new Error("Access denied");
      if (error.response?.status === 500) throw new Error("Server error");
      throw error;
    }
  },

  // Get orders by specific status
  getOrdersByStatus: async (status, page = 0, size = 20) => {
    return await managerOrderService.getOrdersPaging(page, size, status);
  },

  // Status configuration - Updated with new statuses
  getAvailableStatuses: () => [
    // { key: "CHO_XAC_NHAN", label: "Chờ xác nhận", color: "yellow" },
    // { key: "DA_XAC_NHAN", label: "Đã xác nhận", color: "green" },
    // {
    //   key: "CHO_THANH_TOAN",
    //   label: "Chờ thanh toán tiền hàng",
    //   color: "orange",
    // },
    // {
    //   key: "CHO_THANH_TOAN_DAU_GIA",
    //   label: "Chờ thanh toán đấu giá",
    //   color: "pink",
    // },
    // { key: "CHO_THANH_TOAN_SHIP", label: "Chờ thanh toán ship", color: "teal" },
    // { key: "CHO_MUA", label: "Chờ mua", color: "blue" },
    // { key: "CHO_NHAP_KHO_NN", label: "Chờ nhập kho NN", color: "cyan" },
    // { key: "CHO_DONG_GOI", label: "Chờ đóng gói", color: "purple" },
    // { key: "DANG_XU_LY", label: "Đang xử lý", color: "indigo" },
    // { key: "DA_GIAO", label: "Đã giao", color: "emerald" },
    // { key: "DA_HOAN_THANH", label: "Đã hoàn thành", color: "emerald" },
    // { key: "DA_HUY", label: "Đã hủy", color: "red" },

    {
      key: "CHO_THANH_TOAN",
      label: "Chờ thanh toán tiền hàng",
      color: "orange",
    },
    {
      key: "CHO_THANH_TOAN_DAU_GIA",
      label: "Chờ thanh toán đấu giá",
      color: "pink",
    },
    { key: "CHO_MUA", label: "Chờ mua", color: "blue" },
    { key: "CHO_NHAP_KHO_NN", label: "Đang về kho NN", color: "cyan" },
    { key: "CHO_DONG_GOI", label: "Đã về kho NN", color: "purple" },
    { key: "DA_DU_HANG ", label: "Đang về khi VN", color: "lime" },
    { key: "CHO_THANH_TOAN_SHIP", label: "Chờ thanh toán ship", color: "teal" },
    { key: "CHO_GIAO", label: "Chờ giao hàng", color: "amber" },
    { key: "DA_GIAO", label: "Hoàn thành đơn hàng", color: "amber" },
    { key: "DA_HUY", label: "Đã hủy", color: "red" },

    // { key: "DANG_XU_LY", label: "Đang xử lý", color: "indigo" },
    // { key: "DA_GIAO", label: "Đã giao", color: "emerald" },
    // { key: "DA_HOAN_THANH", label: "Đã hoàn thành", color: "emerald" },
    // { key: "DA_HUY", label: "Đã hủy", color: "red" },
  ],
};

export default managerOrderService;
