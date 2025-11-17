// // src/Services/LeadSale/createorderpayment.jsx
// import api from "../../config/api.js";

// const createOrderPaymentService = {
//   // Lấy danh sách đơn hàng đã xác nhận (DA_XAC_NHAN)
//   getConfirmedOrders: async (page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       const response = await api.get(
//         `/orders/for-payment/${page}/${size}/DA_XAC_NHAN`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching confirmed orders:",
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   // Lấy danh sách đơn hàng chờ thanh toán ship (CHO_THANH_TOAN_SHIP)
//   getPendingShipPaymentOrders: async (page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       const response = await api.get(
//         `/orders/for-payment/${page}/${size}/CHO_THANH_TOAN_SHIP`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching pending ship payment orders:",
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   // Lấy danh sách đơn hàng chờ thanh toán (CHO_THANH_TOAN)
//   getPendingPaymentOrders: async (page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       const response = await api.get(
//         `/orders/for-payment/${page}/${size}/CHO_THANH_TOAN`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching pending payment orders:",
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   // Lấy danh sách đơn hàng chờ nhập kho Việt Nam (DA_DU_HANG)
//   getPendingWarehouseVNOrders: async (page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       const response = await api.get(
//         `/orders/for-payment/${page}/${size}/DA_DU_HANG`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching pending warehouse VN orders:",
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   // Lấy đơn hàng theo status cụ thể
//   getOrdersByStatus: async (status, page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (!status || typeof status !== "string") {
//         throw new Error("Status must be a non-empty string");
//       }
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       // Validate status values
//       const validStatuses = [
//         "DA_XAC_NHAN",
//         "CHO_THANH_TOAN_SHIP",
//         "CHO_THANH_TOAN",
//         "DA_DU_HANG",
//       ];
//       if (!validStatuses.includes(status)) {
//         throw new Error(
//           `Invalid status. Must be one of: ${validStatuses.join(", ")}`
//         );
//       }

//       const response = await api.get(
//         `/orders/for-payment/${page}/${size}/${status}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         `Error fetching orders with status ${status}:`,
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   // Lấy tất cả các loại đơn hàng
//   getAllFilteredOrders: async (page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       const [
//         confirmedOrders,
//         pendingShipOrders,
//         pendingPaymentOrders,
//         pendingWarehouseVNOrders,
//       ] = await Promise.all([
//         createOrderPaymentService.getConfirmedOrders(page, size),
//         createOrderPaymentService.getPendingShipPaymentOrders(page, size),
//         createOrderPaymentService.getPendingPaymentOrders(page, size),
//         createOrderPaymentService.getPendingWarehouseVNOrders(page, size),
//       ]);

//       return {
//         confirmedOrders: confirmedOrders,
//         pendingShipOrders: pendingShipOrders,
//         pendingPaymentOrders: pendingPaymentOrders,
//         pendingWarehouseVNOrders: pendingWarehouseVNOrders,
//         totalOrders: [
//           ...(confirmedOrders.content || []),
//           ...(pendingShipOrders.content || []),
//           ...(pendingPaymentOrders.content || []),
//           ...(pendingWarehouseVNOrders.content || []),
//         ],
//       };
//     } catch (error) {
//       console.error(
//         "Error fetching all filtered orders:",
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   // Lấy cả 2 loại đơn hàng ban đầu (DA_XAC_NHAN và CHO_THANH_TOAN_SHIP) - giữ lại để tương thích
//   getFilteredOrders: async (page = 0, size = 10) => {
//     try {
//       // Input validation
//       if (typeof page !== "number" || page < 0) {
//         throw new Error("Page must be a non-negative number");
//       }
//       if (typeof size !== "number" || size < 1 || size > 100) {
//         throw new Error("Size must be between 1 and 100");
//       }

//       const [confirmedOrders, pendingShipOrders] = await Promise.all([
//         createOrderPaymentService.getConfirmedOrders(page, size),
//         createOrderPaymentService.getPendingShipPaymentOrders(page, size),
//       ]);

//       return {
//         confirmedOrders: confirmedOrders,
//         pendingShipOrders: pendingShipOrders,
//         totalOrders: [
//           ...(confirmedOrders.content || []),
//           ...(pendingShipOrders.content || []),
//         ],
//       };
//     } catch (error) {
//       console.error("Error fetching filtered orders:", error.response || error);
//       throw error;
//     }
//   },

//   // Utility method để lấy tất cả các status có sẵn
//   getAvailableStatuses: () => {
//     return [
//       { key: "DA_XAC_NHAN", label: "Đã xác nhận", color: "green" },
//       {
//         key: "CHO_THANH_TOAN_SHIP",
//         label: "Chờ thanh toán ship",
//         color: "yellow",
//       },
//       { key: "CHO_THANH_TOAN", label: "Chờ thanh toán", color: "orange" },
//       { key: "DA_DU_HANG", label: "Đã đủ hàng", color: "blue" },
//     ];
//   },

//   // Lấy thống kê đơn hàng theo status
//   getOrderStatistics: async () => {
//     try {
//       const statuses = createOrderPaymentService.getAvailableStatuses();
//       const statistics = await Promise.allSettled(
//         statuses.map(async (status) => {
//           try {
//             const data = await createOrderPaymentService.getOrdersByStatus(
//               status.key,
//               0,
//               1
//             );
//             return {
//               status: status.key,
//               label: status.label,
//               color: status.color,
//               total: data.totalElements || 0,
//             };
//           } catch (error) {
//             console.warn(
//               `Failed to get statistics for status ${status.key}:`,
//               error
//             );
//             return {
//               status: status.key,
//               label: status.label,
//               color: status.color,
//               total: 0,
//             };
//           }
//         })
//       );

//       return statistics
//         .filter((result) => result.status === "fulfilled")
//         .map((result) => result.value);
//     } catch (error) {
//       console.error(
//         "Error fetching order statistics:",
//         error.response || error
//       );
//       throw error;
//     }
//   },

//   //  NEW: Lấy danh sách payments đấu giá (Auction Payments)
//   getAuctionPayments: async () => {
//     try {
//       const response = await api.get(`/payments/auction`);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching auction payments:",
//         error.response || error
//       );
//       throw error;
//     }
//   },
// };

// // Export both object and backward compatibility functions
// export default createOrderPaymentService;

// // BACKWARD COMPATIBILITY
// export const getConfirmedOrders = createOrderPaymentService.getConfirmedOrders;
// export const getPendingShipPaymentOrders =
//   createOrderPaymentService.getPendingShipPaymentOrders;
// export const getPendingPaymentOrders =
//   createOrderPaymentService.getPendingPaymentOrders;
// export const getPendingWarehouseVNOrders =
//   createOrderPaymentService.getPendingWarehouseVNOrders;
// export const getFilteredOrders = createOrderPaymentService.getFilteredOrders;
// export const getAllFilteredOrders =
//   createOrderPaymentService.getAllFilteredOrders;
// export const getOrdersByStatus = createOrderPaymentService.getOrdersByStatus;
// export const getAvailableStatuses =
//   createOrderPaymentService.getAvailableStatuses;
// export const getAuctionPayments = createOrderPaymentService.getAuctionPayments;

// src/Services/LeadSale/createorderpayment.jsx
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
      pendingPaymentOrders,
      pendingWarehouseVNOrders,
    ] = await Promise.all([
      createOrderPaymentService.getConfirmedOrders(page, size),
      createOrderPaymentService.getPendingShipPaymentOrders(page, size),
      createOrderPaymentService.getPendingPaymentOrders(page, size),
      createOrderPaymentService.getPendingWarehouseVNOrders(page, size),
    ]);

    return {
      confirmedOrders,
      pendingShipOrders,
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
