import axios from "axios";

const BASE_URL = "https://t-6cn5.onrender.com";

const destinationService = {
  // Get all destinations
  getDestinations: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/destinations`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching destinations:", error);
      throw error;
    }
  },
};

export default destinationService;
