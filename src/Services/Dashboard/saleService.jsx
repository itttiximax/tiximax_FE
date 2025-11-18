// src/Services/Sale/saleService.jsx
import api from "../../config/api.js";

/**
 * Chuẩn hóa ngày về định dạng YYYY-MM-DD.
 * Hỗ trợ: Date | string(YYYY-MM-DD) | number(timestamp)
 */
const toYMD = (d) => {
  if (!d && d !== 0) return null;
  const date =
    d instanceof Date
      ? d
      : typeof d === "number"
      ? new Date(d)
      : new Date(String(d));
  if (isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

/**
 * Validate khoảng ngày (start <= end)
 */
const validateRange = (startYMD, endYMD) => {
  if (!startYMD || !endYMD) {
    throw new Error("startDate và endDate là bắt buộc (YYYY-MM-DD).");
  }
  if (startYMD > endYMD) {
    throw new Error("startDate không được lớn hơn endDate.");
  }
};

/**
 * Lấy hiệu suất cá nhân theo khoảng ngày.
 * @param {Date|string|number} startDate - Ngày bắt đầu (YYYY-MM-DD | Date | timestamp)
 * @param {Date|string|number} endDate   - Ngày kết thúc (YYYY-MM-DD | Date | timestamp)
 * @param {AbortSignal} [signal]         - AbortController signal (tùy chọn)
 * @returns {Promise<any>}               - Dữ liệu hiệu suất
 *
 * Ví dụ:
 *   const data = await saleService.getMyPerformance("2025-11-08", "2025-11-10");
 */
const getMyPerformance = async (startDate, endDate, signal) => {
  const startYMD = toYMD(startDate);
  const endYMD = toYMD(endDate);
  validateRange(startYMD, endYMD);

  try {
    const { data } = await api.get("/accounts/my-performance", {
      params: { startDate: startYMD, endDate: endYMD },
      signal, // hỗ trợ hủy request nếu cần
      headers: {
        Accept: "application/json",
      },
    });
    return data;
  } catch (err) {
    // Chuẩn hóa thông điệp lỗi
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Không thể lấy dữ liệu hiệu suất.";
    // Có thể log thêm err.response?.data nếu cần debug
    throw new Error(msg);
  }
};

/**
 * Helper nhanh theo preset range
 * @param {"today"|"yesterday"|"last7days"|"thisMonth"} preset
 */
const getMyPerformanceByPreset = async (preset = "today", signal) => {
  const now = new Date();
  const end = toYMD(now);

  const clone = (d) => new Date(d.getTime());
  let startD = clone(now);

  switch (preset) {
    case "yesterday": {
      startD.setDate(startD.getDate() - 1);
      const y = toYMD(startD);
      return getMyPerformance(y, y, signal);
    }
    case "last7days": {
      startD.setDate(startD.getDate() - 6);
      return getMyPerformance(toYMD(startD), end, signal);
    }
    case "thisMonth": {
      startD = new Date(now.getFullYear(), now.getMonth(), 1);
      return getMyPerformance(toYMD(startD), end, signal);
    }
    case "today":
    default: {
      const ymd = toYMD(now);
      return getMyPerformance(ymd, ymd, signal);
    }
  }
};

const saleService = {
  getMyPerformance,
  getMyPerformanceByPreset,
};

export default saleService;
