import api from "../../config/api";

const createShipment = async (shipmentId, shipmentData) => {
  const response = await api.post(
    `/warehouse/shipment/${shipmentId}`,
    shipmentData
  );
  return response.data;
};

// ✨ API mới - Lấy danh sách shipment theo IDs
const listShipments = async (shipmentIds) => {
  const response = await api.post(`/warehouse/list-shipment`, shipmentIds);
  return response.data;
};

export { createShipment, listShipments };
