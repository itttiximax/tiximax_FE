// src/Services/createAccountRoutesService.js
import api from "../../config/api.js";

const createAccountRoutesService = {
  // Assign route to account
  assignRouteToAccount: async (accountId, routeId) => {
    try {
      // Validation
      if (!accountId || !routeId) {
        throw new Error("accountId and routeId are required");
      }

      if (accountId <= 0 || routeId <= 0) {
        throw new Error("accountId and routeId must be positive numbers");
      }

      const response = await api.post(`/account-routes`, null, {
        params: {
          accountId,
          routeId,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error assigning route to account:`, error);

      if (error.response?.status === 404) {
        throw new Error("Account or Route not found");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request parameters");
      } else if (error.response?.status === 401) {
        throw new Error("Unauthorized - Please login again");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied - insufficient permissions");
      } else if (error.response?.status === 409) {
        throw new Error("Route already assigned to this account");
      } else if (error.response?.status === 500) {
        throw new Error("Server error");
      }

      throw error;
    }
  },
};

export default createAccountRoutesService;
