// /src/Services/Payment/createPaymentShipService.jsx
import api from "../../config/api.js";

const createPaymentShipService = {
  async createPaymentShipping(
    isUseBalance,
    customerVoucherId,
    bankId,
    priceShipDos,
    itemCodes
  ) {
    if (!Array.isArray(itemCodes) || !itemCodes.length)
      throw new Error("itemCodes phải là mảng và không được rỗng.");
    if (!bankId) throw new Error("bankId là bắt buộc.");

    const flag = !!isUseBalance;
    const voucherSeg = customerVoucherId ?? "null"; // khi không có voucher -> "null"
    const url = `/payments/merged-shipping/${flag}/${bankId}/${priceShipDos}/${voucherSeg}`;

    const { data } = await api.post(url, itemCodes); // body là mảng
    return data;
  },
  async createPartialShipment(
    isUseBalance,
    bankId,
    customerVoucherId,
    selectedShipmentCodes
  ) {
    if (
      !Array.isArray(selectedShipmentCodes) ||
      selectedShipmentCodes.length === 0
    ) {
      throw new Error("selectedShipmentCodes phải là mảng và không được rỗng.");
    }
    if (!bankId) throw new Error("bankId là bắt buộc.");

    const flag = !!isUseBalance;
    // Nếu không có voucher, backend nhận giá trị "null" (string)
    const url = `/partial-shipment/partial-shipment/${flag}/${bankId}/${
      customerVoucherId ?? "null"
    }`;
    const body = { selectedShipmentCodes };

    const { data } = await api.post(url, body);
    return data;
  },
};

export default createPaymentShipService;
