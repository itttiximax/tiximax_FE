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
};

export default createPaymentShipService;
