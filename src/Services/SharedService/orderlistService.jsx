import axios from "axios";

const API_BASE_URL = "https://t-6cn5.onrender.com";

class OrderListService {
  // Lấy danh sách đơn hàng đã xác nhận (DA_XAC_NHAN)
  async getConfirmedOrders(page = 0, size = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/for-payment/${page}/${size}/DA_XAC_NHAN`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching confirmed orders:", error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng chờ thanh toán ship (CHO_THANH_TOAN_SHIP)
  async getPendingShipPaymentOrders(page = 0, size = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/for-payment/${page}/${size}/CHO_THANH_TOAN_SHIP`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending ship payment orders:", error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng chờ thanh toán (CHO_THANH_TOAN)
  async getPendingPaymentOrders(page = 0, size = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/for-payment/${page}/${size}/CHO_THANH_TOAN`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending payment orders:", error);
      throw error;
    }
  }

  // Lấy danh sách đơn hàng chờ nhập kho Việt Nam (CHO_NHAP_KHO_VN)
  async getPendingWarehouseVNOrders(page = 0, size = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/for-payment/${page}/${size}/CHO_NHAP_KHO_VN`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching pending warehouse VN orders:", error);
      throw error;
    }
  }

  // Lấy tất cả các loại đơn hàng
  async getAllFilteredOrders(page = 0, size = 10) {
    try {
      const [
        confirmedOrders,
        pendingShipOrders,
        pendingPaymentOrders,
        pendingWarehouseVNOrders,
      ] = await Promise.all([
        this.getConfirmedOrders(page, size),
        this.getPendingShipPaymentOrders(page, size),
        this.getPendingPaymentOrders(page, size),
        this.getPendingWarehouseVNOrders(page, size),
      ]);

      return {
        confirmedOrders: confirmedOrders,
        pendingShipOrders: pendingShipOrders,
        pendingPaymentOrders: pendingPaymentOrders,
        pendingWarehouseVNOrders: pendingWarehouseVNOrders,
        totalOrders: [
          ...(confirmedOrders.content || []),
          ...(pendingShipOrders.content || []),
          ...(pendingPaymentOrders.content || []),
          ...(pendingWarehouseVNOrders.content || []),
        ],
      };
    } catch (error) {
      console.error("Error fetching all filtered orders:", error);
      throw error;
    }
  }

  // Lấy cả 2 loại đơn hàng ban đầu (DA_XAC_NHAN và CHO_THANH_TOAN_SHIP) - giữ lại để tương thích
  async getFilteredOrders(page = 0, size = 10) {
    try {
      const [confirmedOrders, pendingShipOrders] = await Promise.all([
        this.getConfirmedOrders(page, size),
        this.getPendingShipPaymentOrders(page, size),
      ]);

      return {
        confirmedOrders: confirmedOrders,
        pendingShipOrders: pendingShipOrders,
        totalOrders: [
          ...(confirmedOrders.content || []),
          ...(pendingShipOrders.content || []),
        ],
      };
    } catch (error) {
      console.error("Error fetching filtered orders:", error);
      throw error;
    }
  }

  // Lấy đơn hàng theo status cụ thể
  async getOrdersByStatus(status, page = 0, size = 10) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/for-payment/${page}/${size}/${status}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      throw error;
    }
  }

  // Utility method để lấy tất cả các status có sẵn
  getAvailableStatuses() {
    return [
      { key: "DA_XAC_NHAN", label: "Đã xác nhận" },
      { key: "CHO_THANH_TOAN_SHIP", label: "Chờ thanh toán ship" },
      { key: "CHO_THANH_TOAN", label: "Chờ thanh toán" },
      { key: "CHO_NHAP_KHO_VN", label: "Chờ nhập kho Việt Nam" },
    ];
  }
}

// Export instance để sử dụng
const orderListService = new OrderListService();
export default orderListService;

// Export các hàm riêng lẻ nếu cần
export const {
  getConfirmedOrders,
  getPendingShipPaymentOrders,
  getPendingPaymentOrders,
  getPendingWarehouseVNOrders,
  getFilteredOrders,
  getAllFilteredOrders,
  getOrdersByStatus,
  getAvailableStatuses,
} = orderListService;
