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
const getShipmentInfo = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required");

  const response = await api.get(`/orders/info-shipment/${orderId}`);
  return response.data;
};
export { createShipment, listShipments, getShipmentInfo };
