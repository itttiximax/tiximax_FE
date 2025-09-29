// src/Services/userService.js
import api from "../../config/api.js";

const userService = {
  // Get staff accounts with pagination
  getStaffAccounts: async (page = 0, size = 10) => {
    try {
      // Validation
      if (page < 0 || size < 1 || size > 100) {
        throw new Error("Invalid parameters");
      }

      const response = await api.get(`/accounts/staff/${page}/${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff accounts:`, error);

      if (error.response?.status === 404) {
        throw new Error("API endpoint not found");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request parameters");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied - insufficient permissions");
      } else if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },

  // Get customer accounts with pagination
  getCustomerAccounts: async (page = 0, size = 10) => {
    try {
      // Validation
      if (page < 0 || size < 1 || size > 100) {
        throw new Error("Invalid parameters");
      }

      const response = await api.get(`/accounts/customers/${page}/${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer accounts:`, error);

      if (error.response?.status === 404) {
        throw new Error("API endpoint not found");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request parameters");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied - insufficient permissions");
      } else if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },

  // Get my customers (assigned to current staff) with pagination
  getMyCustomers: async (page = 0, size = 10) => {
    try {
      // Validation
      if (page < 0 || size < 1 || size > 100) {
        throw new Error("Invalid parameters");
      }

      const response = await api.get(`/accounts/my-customers/${page}/${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching my customers:`, error);

      if (error.response?.status === 404) {
        throw new Error("API endpoint not found");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request parameters");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied - insufficient permissions");
      } else if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },

  // Get staff roles configuration
  getAvailableRoles: () => [
    { key: "ADMIN", label: "Quản trị viên", color: "red" },
    { key: "MANAGER", label: "Quản lý", color: "orange" },
    { key: "STAFF_SALE", label: "Nhân viên bán hàng", color: "blue" },
    { key: "STAFF_WAREHOUSE", label: "Nhân viên kho", color: "purple" },
    {
      key: "STAFF_WAREHOUSE_DOMESTIC",
      label: "Nhân viên kho nội địa",
      color: "indigo",
    },
    { key: "LEAD_SALE", label: "Trưởng nhóm bán hàng", color: "green" },
  ],

  // Get account status configuration
  getAvailableStatuses: () => [
    { key: "HOAT_DONG", label: "Hoạt động", color: "green" },
    { key: "KHONG_HOAT_DONG", label: "Không hoạt động", color: "gray" },
  ],
};

export default userService;
