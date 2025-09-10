// src/Services/SharedService/profileService.jsx
import api from "../../config/api.js";

const profileService = {
  // Get current account profile
  getCurrentAccount: async () => {
    try {
      const response = await api.get("/accounts/accountCurrent");
      return response.data;
    } catch (error) {
      console.error("Error fetching current account:", error.response || error);
      throw error;
    }
  },

  // Get account by ID
  getAccountById: async (accountId) => {
    try {
      // Input validation
      if (!accountId) {
        throw new Error("Account ID is required");
      }

      if (typeof accountId !== "number" && typeof accountId !== "string") {
        throw new Error("Account ID must be a number or string");
      }

      const response = await api.get(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching account by ID:", error.response || error);
      throw error;
    }
  },

  // Check if user is authenticated (client-side check)
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem("token");
  },
};

// Export both object and backward compatibility functions
export default profileService;

// BACKWARD COMPATIBILITY
export const getCurrentAccount = profileService.getCurrentAccount;
export const getAccountById = profileService.getAccountById;
