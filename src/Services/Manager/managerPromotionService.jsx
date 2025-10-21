import api from "../../config/api.js";

const managerPromotionService = {
  // 🟢 Tạo voucher
  createVoucher: async (data) => {
    const res = await api.post("/vouchers", data);
    return res.data;
  },

  // 🟢 Lấy danh sách voucher có phân trang
  getVouchers: async (page = 0, size = 10) => {
    const res = await api.get(`/vouchers/${page}/${size}/paging`);
    return res.data;
  },

  // 🟢 Xóa voucher theo ID
  deleteVoucher: async (id) => {
    const res = await api.delete(`/vouchers/${id}`);
    return res.status;
  },

  // 🟢 Cập nhật voucher theo ID
  updateVoucher: async (id, data) => {
    const res = await api.put(`/vouchers/${id}`, data);
    return res.data;
  },
};

export default managerPromotionService;
