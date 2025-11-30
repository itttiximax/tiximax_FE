// api/dashboardService.jsx
import api from "../../config/api"; // axios instance

const dashboardService = {
  // 1. GET Weights
  getWeights: (params) => {
    return api.get("/dashboard/admin/weights", { params });
  },

  // 2. GET Payments
  getPayments: (params) => {
    return api.get("/dashboard/admin/payments", { params });
  },

  // 3. GET Orders
  getOrders: (params) => {
    return api.get("/dashboard/admin/orders", { params });
  },

  // 4. GET Customers
  getCustomers: (params) => {
    return api.get("/dashboard/admin/customers", { params });
  },

  // 5. GET Dashboard Filter (DAY, MONTH, QUARTER, HALF_YEAR)
  getDashboardFilter: (filterType) => {
    return api.get("/dashboard", {
      params: { filterType },
    });
  },
};

export default dashboardService;
