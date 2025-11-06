// /src/Services/Payment/createPaymentShipService.jsx
import api from "../../config/api.js";

const createPaymentShipService = {
  async createPaymentShipping(
    isUseBalance,
    customerVoucherId,
    bankId,
    itemCodes
  ) {
    if (!Array.isArray(itemCodes) || !itemCodes.length)
      throw new Error("itemCodes phải là mảng và không được rỗng.");
    if (!bankId) throw new Error("bankId là bắt buộc.");

    const flag = !!isUseBalance;
    const voucherSeg = customerVoucherId ?? "null"; // khi không có voucher -> "null"
    const url = `/payments/merged-shipping/${flag}/${bankId}/${voucherSeg}`;

    const { data } = await api.post(url, itemCodes); // body là mảng
    return data;
  },
  async createPartialShipment(
    isUseBalance,
    bankId,
    customerVoucherId,
    selectedShipmentCodes
  ) {
    if (!Array.isArray(selectedShipmentCodes) || !selectedShipmentCodes.length)
      throw new Error("selectedTrackingCodes phải là mảng và không được rỗng.");
    if (!bankId) throw new Error("bankId là bắt buộc.");

    const flag = !!isUseBalance;

    // ✅ Nếu có voucher thì thêm vào URL, nếu không thì bỏ qua
    const baseUrl = `/partial-shipment/partial-shipment/${flag}/${bankId}`;
    const url = customerVoucherId ? `${baseUrl}/${customerVoucherId}` : baseUrl;

    const body = { selectedShipmentCodes };

    const { data } = await api.post(url, body);
    return data;
  },
};

export default createPaymentShipService;
