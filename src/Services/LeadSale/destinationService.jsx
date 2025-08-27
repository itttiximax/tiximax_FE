import api from "../../config/api.js"; // ← THAY ĐỔI: import api thay vì axios

const destinationService = {
  // Get all destinations
  getDestinations: async () => {
    // ← THAY ĐỔI: bỏ token parameter
    try {
      const response = await api.get("/destinations");
      return response.data;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw error;
    }
  },

  // Get destination by ID
  getDestinationById: async (id) => {
    try {
      if (!id) throw new Error("Destination ID is required");
      const response = await api.get(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching destination ${id}:`, error);
      throw error;
    }
  },

  // Create new destination
  createDestination: async (data) => {
    try {
      if (!data) throw new Error("Destination data is required");
      const response = await api.post("/destinations", data);
      return response.data;
    } catch (error) {
      console.error("Error creating destination:", error);
      throw error;
    }
  },

  // Update destination
  updateDestination: async (id, data) => {
    try {
      if (!id) throw new Error("Destination ID is required");
      if (!data) throw new Error("Destination data is required");
      const response = await api.put(`/destinations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating destination ${id}:`, error);
      throw error;
    }
  },

  // Delete destination
  deleteDestination: async (id) => {
    try {
      if (!id) throw new Error("Destination ID is required");
      const response = await api.delete(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting destination ${id}:`, error);
      throw error;
    }
  },
};

export default destinationService;
