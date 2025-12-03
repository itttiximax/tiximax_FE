// src/Services/Dashboard/saleService.jsx
import api from "../../config/api.js";

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

const validateRange = (startYMD, endYMD) => {
  if (!startYMD || !endYMD) {
    throw new Error("startDate và endDate là bắt buộc (YYYY-MM-DD).");
  }
  if (startYMD > endYMD) {
    throw new Error("startDate không được lớn hơn endDate.");
  }
};

const getMyPerformance = async (startDate, endDate, signal) => {
  const startYMD = toYMD(startDate);
  const endYMD = toYMD(endDate);
  validateRange(startYMD, endYMD);

  try {
    const { data } = await api.get("/accounts/my-performance", {
      params: { startDate: startYMD, endDate: endYMD },
      signal,
      headers: {
        Accept: "application/json",
      },
    });
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Không thể lấy dữ liệu hiệu suất.";
    throw new Error(msg);
  }
};

const saleService = {
  getMyPerformance,
};

export default saleService;
