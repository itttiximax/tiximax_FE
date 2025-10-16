// Services/Payment/createPaymentShipService.js
import api from "../../config/api.js";

const createPaymentShipService = {
  createPaymentShipping: async (isUseBalance, voucherId, itemCodes) => {
    if (!Array.isArray(itemCodes) || itemCodes.length === 0) {
      throw new Error("itemCodes phải là mảng và không được rỗng.");
    }
    // Ép boolean chuẩn, voucherId để nguyên (số hoặc "null"/0 tùy backend)
    const flag = Boolean(isUseBalance);
    const url = `/payments/merged-shipping/${flag}/${voucherId}`;
    const res = await api.post(url, itemCodes);
    return res.data;
  },
};

export default createPaymentShipService;
