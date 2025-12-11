import api from "../../config/api.js";

const createOrderPaymentService = {
  // Lấy đơn hàng theo status
  getOrdersByStatus: async (status, page = 0, size = 10) => {
    const response = await api.get(
      `/orders/for-payment/${page}/${size}/${status}`
    );
    return response.data;
  },

  // Lấy danh sách đơn hàng đã xác nhận
  getConfirmedOrders: async (page = 0, size = 10) => {
    const response = await api.get(
      `/orders/for-payment/${page}/${size}/DA_XAC_NHAN`
    );
    return response.data;
  },

  // Lấy danh sách đơn hàng chờ thanh toán ship
  getPendingShipPaymentOrders: async (page = 0, size = 10) => {
    const response = await api.get(
      `/orders/for-payment/${page}/${size}/CHO_THANH_TOAN_SHIP`
    );
    return response.data;
  },

  // Lấy danh sách đơn hàng chờ thanh toán
  getPendingPaymentOrders: async (page = 0, size = 10) => {
    const response = await api.get(
      `/orders/for-payment/${page}/${size}/CHO_THANH_TOAN`
    );
    return response.data;
  },

  getPendingPaymentAuction: async (page = 0, size = 10) => {
    const response = await api.get(
      `/orders/for-payment/${page}/${size}/ DAU_GIA_THANH_CONG`
    );
    return response.data;
  },

  // Lấy danh sách đơn hàng đã đủ hàng
  getPendingWarehouseVNOrders: async (page = 0, size = 10) => {
    const response = await api.get(
      `/orders/for-payment/${page}/${size}/DA_DU_HANG`
    );
    return response.data;
  },

  // Lấy tất cả các loại đơn hàng
  getAllFilteredOrders: async (page = 0, size = 10) => {
    const [
      confirmedOrders,
      pendingShipOrders,
      pendingPaymentAuction,
      pendingPaymentOrders,
      pendingWarehouseVNOrders,
    ] = await Promise.all([
      createOrderPaymentService.getConfirmedOrders(page, size),
      createOrderPaymentService.getPendingShipPaymentOrders(page, size),
      createOrderPaymentService.getPendingPaymentAuction(page, size),
      createOrderPaymentService.getPendingPaymentOrders(page, size),
      createOrderPaymentService.getPendingWarehouseVNOrders(page, size),
    ]);

    return {
      confirmedOrders,
      pendingShipOrders,
      pendingPaymentAuction,
      pendingPaymentOrders,
      pendingWarehouseVNOrders,
      totalOrders: [
        ...(confirmedOrders.content || []),
        ...(pendingShipOrders.content || []),
        ...(pendingPaymentOrders.content || []),
        ...(pendingWarehouseVNOrders.content || []),
      ],
    };
  },

  // Lấy 2 loại đơn hàng ban đầu
  getFilteredOrders: async (page = 0, size = 10) => {
    const [confirmedOrders, pendingShipOrders] = await Promise.all([
      createOrderPaymentService.getConfirmedOrders(page, size),
      createOrderPaymentService.getPendingShipPaymentOrders(page, size),
    ]);

    return {
      confirmedOrders,
      pendingShipOrders,
      totalOrders: [
        ...(confirmedOrders.content || []),
        ...(pendingShipOrders.content || []),
      ],
    };
  },

  // Lấy danh sách các status
  getAvailableStatuses: () => [
    { key: "DA_XAC_NHAN", label: "Đã xác nhận", color: "green" },
    {
      key: "CHO_THANH_TOAN_SHIP",
      label: "Chờ thanh toán ship",
      color: "yellow",
    },
    { key: "CHO_THANH_TOAN", label: "Chờ thanh toán", color: "orange" },
    { key: "DA_DU_HANG", label: "Đã đủ hàng", color: "blue" },
  ],

  // Lấy thống kê đơn hàng
  getOrderStatistics: async () => {
    const statuses = createOrderPaymentService.getAvailableStatuses();
    const statistics = await Promise.allSettled(
      statuses.map(async (status) => {
        try {
          const data = await createOrderPaymentService.getOrdersByStatus(
            status.key,
            0,
            1
          );
          return {
            status: status.key,
            label: status.label,
            color: status.color,
            total: data.totalElements || 0,
          };
        } catch {
          return {
            status: status.key,
            label: status.label,
            color: status.color,
            total: 0,
          };
        }
      })
    );

    return statistics
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  },

  // Lấy danh sách payments đấu giá
  getAuctionPayments: async () => {
    const response = await api.get(`/payments/auction`);
    return response.data;
  },
};

export default createOrderPaymentService;

export const {
  getConfirmedOrders,
  getPendingShipPaymentOrders,
  getPendingPaymentOrders,
  getPendingWarehouseVNOrders,
  getFilteredOrders,
  getAllFilteredOrders,
  getOrdersByStatus,
  getAvailableStatuses,
  getAuctionPayments,
} = createOrderPaymentService;
