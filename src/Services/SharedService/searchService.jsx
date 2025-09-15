// src/Services/searchService.jsx
import api from "../../config/api.js";

const searchService = {
  // Search accounts
  searchAccounts: async (query = "") => {
    try {
      // Input validation
      if (typeof query !== "string") {
        throw new Error("Query must be a string");
      }
      const response = await api.get("/accounts/search", {
        params: { q: query }, // nếu BE hỗ trợ query param ?q=
      });
      return response.data;
    } catch (error) {
      console.error("Error searching accounts:", error.response || error);
      throw error;
    }
  },

  // Get all accounts (nếu cần lấy toàn bộ, không search)
  getAllAccounts: async () => {
    try {
      const response = await api.get("/accounts/search");
      return response.data;
    } catch (error) {
      console.error("Error fetching all accounts:", error.response || error);
      throw error;
    }
  },

  // Search website
  searchWebsite: async (keyword = "") => {
    try {
      // Input validation
      if (typeof keyword !== "string") {
        throw new Error("Keyword must be a string");
      }

      const response = await api.get("/website/search", {
        params: { keyword: keyword },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching website:", error.response || error);
      throw error;
    }
  },
};

// Export both object and backward compatibility function
export default searchService;

// BACKWARD COMPATIBILITY
export const searchAccountsService = searchService.searchAccounts;
export const searchWebsiteService = searchService.searchWebsite;
