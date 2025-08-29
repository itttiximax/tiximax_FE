import api from "../../config/api";

const registrationService = {
  // Register customer
  registerCustomer: async (registrationData) => {
    try {
      // Input validation
      if (!registrationData) {
        throw new Error("Registration data is required");
      }

      const requiredFields = ["username", "password", "email", "phone", "name"];
      for (const field of requiredFields) {
        if (!registrationData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Set default values if not provided
      const dataWithDefaults = {
        role: "CUSTOMER",
        type: "KHACH_LE",
        ...registrationData,
      };

      // Clean up data - remove empty strings for optional fields
      const cleanedData = Object.keys(dataWithDefaults).reduce((acc, key) => {
        const value = dataWithDefaults[key];
        // Only include non-empty values or required fields
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log("Sending registration data:", cleanedData); // Debug log

      const response = await api.post(
        "/accounts/register/customer",
        cleanedData
      );
      return response.data;
    } catch (error) {
      console.error("Error registering customer:", error.response || error);
      throw error;
    }
  },

  // Validate registration data
  validateRegistrationData: (data) => {
    const errors = {};

    // Username validation
    if (!data.username) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Email validation
    if (!data.email) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!data.phone) {
      errors.phone = "Phone number is required";
    }

    // Name validation
    if (!data.name) {
      errors.name = "Full name is required";
    }

    // Address validation (required for agents only)
    if (data.type === "DAI_LY" && !data.address) {
      errors.address = "Address is required for agents";
    }

    // Tax Code validation (required for agents only)
    if (data.type === "DAI_LY" && !data.taxCode) {
      errors.taxCode = "Tax code is required for agents";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Get customer types
  getCustomerTypes: () => {
    return [
      { value: "KHACH_LE", label: "Khách lẻ" },
      { value: "DAI_LY", label: "Đại lý" },
    ];
  },
};

export default registrationService;

// Export individual functions for backward compatibility
export const registerCustomer = registrationService.registerCustomer;
export const validateRegistrationData =
  registrationService.validateRegistrationData;
export const getCustomerTypes = registrationService.getCustomerTypes;
