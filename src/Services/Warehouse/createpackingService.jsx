// import api from "../../config/api.js";

// export const createPackingService = async (packingData) => {
//   const response = await api.post("/packings", packingData);
//   return response.data;
// };

// export default createPackingService;

import api from "../../config/api.js";

// Create new packing
export const createPackingService = async (packingData) => {
  const response = await api.post("/packings", packingData);
  return response.data;
};

// Check shipment codes before creating packing
export const checkPackingCodesService = async (shipmentCodes) => {
  const response = await api.post("/packings/check", shipmentCodes);
  return response.data;
};

export default createPackingService;
