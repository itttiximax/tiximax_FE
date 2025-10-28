// // Services/Payment/createPaymentShipService.js
// import api from "../../config/api.js";

// const createPaymentShipService = {
//   createPaymentShipping: async (isUseBalance, customerVoucherId, itemCodes) => {
//     if (!Array.isArray(itemCodes) || itemCodes.length === 0) {
//       throw new Error("itemCodes phải là mảng và không được rỗng.");
//     }
//     // Ép boolean chuẩn, voucherId để nguyên (số hoặc "null"/0 tùy backend)
//     const flag = Boolean(isUseBalance);
//     const url = `/payments/merged-shipping/${flag}/${customerVoucherId}`;
//     const res = await api.post(url, itemCodes);
//     return res.data;
//   },
// };

// export default createPaymentShipService;

import api from "../../config/api.js";

const createPaymentShipService = {
  createPaymentShipping: async (isUseBalance, customerVoucherId, itemCodes) => {
    if (!Array.isArray(itemCodes) || itemCodes.length === 0) {
      throw new Error("itemCodes phải là mảng và không được rỗng.");
    }

    const flag = Boolean(isUseBalance);
    // Nếu không có voucher, gửi "null" (string) trong URL
    const voucherId = customerVoucherId || "null";
    const url = `/payments/merged-shipping/${flag}/${voucherId}`;

    const res = await api.post(url, itemCodes);
    return res.data;
  },
};

export default createPaymentShipService;
