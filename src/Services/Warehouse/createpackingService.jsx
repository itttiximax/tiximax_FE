import api from "../../config/api.js";

export const createPackingService = async (packingData) => {
  const response = await api.post("/packings", packingData);
  return response.data;
};

export default createPackingService;
