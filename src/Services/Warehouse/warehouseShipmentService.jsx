import api from "../../config/api";

const createShipment = async (shipmentId, shipmentData) => {
  const response = await api.post(
    `/warehouse/shipment/${shipmentId}`,
    shipmentData
  );
  return response.data;
};

export { createShipment };
