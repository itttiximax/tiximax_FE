import api from "../../config/api.js";
const searchService = {
  searchAccounts: async ({ query = "", limit = 50 }) => {
    try {
      if (typeof query !== "string") {
        throw new Error("Query must be a string");
      }
      const response = await api.get("/accounts/search", {
        params: { q: query, limit },
      });
      return response.data || [];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error("Error searching accounts:", error.response || error);
      throw error;
    }
  },

  // Giữ nguyên các hàm khác
  getAllAccounts: async () => {
    try {
      const response = await api.get("/accounts/search");
      return response.data;
    } catch (error) {
      console.error("Error fetching all accounts:", error.response || error);
      throw error;
    }
  },

  searchWebsite: async (keyword = "") => {
    try {
      if (typeof keyword !== "string") {
        throw new Error("Keyword must be a string");
      }
      const response = await api.get("/website/search", {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching website:", error.response || error);
      throw error;
    }
  },
};

export default searchService;
export const searchAccountsService = searchService.searchAccounts;
export const searchWebsiteService = searchService.searchWebsite;
