import api from "../../config/api";

const registrationService = {
  ROLES: {
    CUSTOMER: "CUSTOMER",
    STAFF_SALE: "STAFF_SALE",
    LEAD_SALE: "LEAD_SALE",
    STAFF_PURCHASER: "STAFF_PURCHASER",
    STAFF_WAREHOUSE_FOREIGN: "STAFF_WAREHOUSE_FOREIGN",
    STAFF_WAREHOUSE_DOMESTIC: "STAFF_WAREHOUSE_DOMESTIC",
    MANAGER: "MANAGER",
    ADMIN: "ADMIN",
  },

  DEPARTMENTS: {
    SALE: "SALE",
    WAREHOUSE: "WAREHOUSE",
    PURCHASING: "PURCHASING",
    MANAGEMENT: "MANAGEMENT",
  },

  registerCustomer: async (registrationData) => {
    try {
      const response = await api.post("/accounts/register/customer", {
        role: "CUSTOMER",
        ...registrationData,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering customer:", error.response || error);
      throw error;
    }
  },

  registerStaff: async (registrationData) => {
    try {
      const response = await api.post(
        "/accounts/register/staff",
        registrationData
      );
      return response.data;
    } catch (error) {
      console.error("Error registering staff:", error.response || error);
      throw error;
    }
  },

  sendOTP: async (email) => {
    try {
      const response = await api.post("/otp/send", null, {
        params: { email }, // ✅ ĐÚNG: Query parameter
      });
      return response.data;
    } catch (error) {
      console.error("Error sending OTP:", error.response || error);
      throw error;
    }
  },
  verifyAccount: async (email, otpCode) => {
    try {
      const response = await api.post("/accounts/verify-account", {
        email,
        otpCode,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying account:", error.response || error);
      throw error;
    }
  },
};

export default registrationService;
