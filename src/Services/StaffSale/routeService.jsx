// // src/Services/LeadSale/routeService.jsx
// import axios from "axios";

// // Base URL của API
// const API_URL = "https://t-6cn5.onrender.com";

// // Hàm lấy routes theo account
// const getRoutesByAccount = async (token) => {
//   try {
//     const response = await axios.get(`${API_URL}/account-routes/by-account`, {
//       headers: {
//         Accept: "*/*",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching account routes:", error.response || error);
//     throw error;
//   }
// };

// export default {
//   getRoutesByAccount,
// };

// src/Services/LeadSale/routeService.jsx
import api from "../../config/api.js";

// Hàm lấy routes theo account
const getRoutesByAccount = async (token) => {
  try {
    const response = await api.get("/account-routes/by-account", {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account routes:", error.response || error);
    throw error;
  }
};

export default {
  getRoutesByAccount,
};
