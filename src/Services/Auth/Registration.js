import api from "../../config/api";

const registrationService = {
  // Available roles in the system
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

  // Department options
  DEPARTMENTS: {
    SALE: "SALE",
    WAREHOUSE: "WAREHOUSE",
    PURCHASING: "PURCHASING",
    MANAGEMENT: "MANAGEMENT",
  },

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

      console.log("Sending customer registration data:", cleanedData);

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

  // Register staff
  registerStaff: async (registrationData) => {
    try {
      // Input validation
      if (!registrationData) {
        throw new Error("Registration data is required");
      }

      const requiredFields = [
        "username",
        "password",
        "email",
        "phone",
        "name",
        "role",
      ];
      for (const field of requiredFields) {
        if (!registrationData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Role-specific required fields validation
      const roleSpecificValidation =
        registrationService.validateRoleSpecificFields(registrationData);
      if (!roleSpecificValidation.isValid) {
        throw new Error(roleSpecificValidation.message);
      }

      // Clean up data - remove empty strings for optional fields
      const cleanedData = Object.keys(registrationData).reduce((acc, key) => {
        const value = registrationData[key];
        // Only include non-empty values
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log("Sending staff registration data:", cleanedData);

      const response = await api.post("/accounts/register/staff", cleanedData);
      return response.data;
    } catch (error) {
      console.error("Error registering staff:", error.response || error);
      throw error;
    }
  },

  // Validate role-specific required fields
  validateRoleSpecificFields: (data) => {
    const { role } = data;

    // For sale roles, department and location might be required
    if (role === "STAFF_SALE" || role === "LEAD_SALE") {
      if (!data.department) {
        return {
          isValid: false,
          message: "Department is required for sale roles",
        };
      }
      if (!data.location) {
        return {
          isValid: false,
          message: "Location is required for sale roles",
        };
      }
      // RouteIds might be required for sale staff
      if (
        role === "STAFF_SALE" &&
        (!data.routeIds || data.routeIds.length === 0)
      ) {
        return {
          isValid: false,
          message: "Route IDs are required for sale staff",
        };
      }
    }

    // For warehouse roles, department and location are required
    if (
      role === "STAFF_WAREHOUSE_FOREIGN" ||
      role === "STAFF_WAREHOUSE_DOMESTIC"
    ) {
      if (!data.department) {
        return {
          isValid: false,
          message: "Department is required for warehouse roles",
        };
      }
      if (!data.location) {
        return {
          isValid: false,
          message: "Location is required for warehouse roles",
        };
      }
    }

    // For purchaser role, department might be required
    if (role === "STAFF_PURCHASER") {
      if (!data.department) {
        return {
          isValid: false,
          message: "Department is required for purchaser role",
        };
      }
    }

    return { isValid: true };
  },

  // Validate registration data for customer
  validateCustomerRegistrationData: (data) => {
    const errors = {};

    // Username validation
    if (!data.username) {
      errors.username = "Tên đăng nhập là bắt buộc";
    } else if (data.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (data.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }

    // Email validation
    if (!data.email) {
      errors.email = "Email là bắt buộc";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Vui lòng nhập địa chỉ email hợp lệ";
      }
    }

    // Phone validation
    if (!data.phone) {
      errors.phone = "Số điện thoại là bắt buộc";
    } else {
      // Vietnamese phone number validation
      const phoneRegex = /^(0[3-9])[0-9]{8}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03-09)";
      }
    }

    // Name validation
    if (!data.name) {
      errors.name = "Họ và tên là bắt buộc";
    } else if (data.name.trim().length < 2) {
      errors.name = "Họ và tên phải có ít nhất 2 ký tự";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Validate registration data for staff
  validateStaffRegistrationData: (data) => {
    // Start with basic validation (same as customer)
    const basicValidation =
      registrationService.validateCustomerRegistrationData(data);
    const errors = { ...basicValidation.errors };

    // Role validation
    if (!data.role) {
      errors.role = "Vai trò là bắt buộc";
    } else if (!Object.values(registrationService.ROLES).includes(data.role)) {
      errors.role = "Vai trò không hợp lệ";
    }

    // Role-specific validation
    if (data.role) {
      // For sale roles
      if (data.role === "STAFF_SALE" || data.role === "LEAD_SALE") {
        if (!data.department) {
          errors.department = "Phòng ban là bắt buộc cho nhân viên bán hàng";
        }
        if (!data.location) {
          errors.location =
            "Địa điểm làm việc là bắt buộc cho nhân viên bán hàng";
        }
        if (
          data.role === "STAFF_SALE" &&
          (!data.routeIds || data.routeIds.length === 0)
        ) {
          errors.routeIds = "Tuyến đường là bắt buộc cho nhân viên bán hàng";
        }
      }

      // For warehouse roles
      if (
        data.role === "STAFF_WAREHOUSE_FOREIGN" ||
        data.role === "STAFF_WAREHOUSE_DOMESTIC"
      ) {
        if (!data.department) {
          errors.department = "Phòng ban là bắt buộc cho nhân viên kho";
        }
        if (!data.location) {
          errors.location = "Địa điểm làm việc là bắt buộc cho nhân viên kho";
        }
      }

      // For purchaser role
      if (data.role === "STAFF_PURCHASER") {
        if (!data.department) {
          errors.department = "Phòng ban là bắt buộc cho nhân viên mua hàng";
        }
      }

      // For manager and admin, location might be required
      if (data.role === "MANAGER" || data.role === "ADMIN") {
        if (!data.location) {
          errors.location = "Địa điểm làm việc là bắt buộc cho quản lý";
        }
      }
    }

    // Department validation if provided
    if (
      data.department &&
      !Object.values(registrationService.DEPARTMENTS).includes(data.department)
    ) {
      errors.department = "Phòng ban không hợp lệ";
    }

    // Route IDs validation if provided
    if (
      data.routeIds &&
      (!Array.isArray(data.routeIds) ||
        data.routeIds.some((id) => !Number.isInteger(id)))
    ) {
      errors.routeIds = "Tuyến đường phải là danh sách các số nguyên";
    }

    // Location validation if provided
    if (data.location && typeof data.location !== "string") {
      errors.location = "Địa điểm làm việc không hợp lệ";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Get required fields based on role
  getRequiredFieldsByRole: (role) => {
    const baseFields = [
      "username",
      "password",
      "email",
      "phone",
      "name",
      "role",
    ];

    switch (role) {
      case "STAFF_SALE":
        return [...baseFields, "department", "location", "routeIds"];
      case "LEAD_SALE":
        return [...baseFields, "department", "location"];
      case "STAFF_WAREHOUSE_FOREIGN":
      case "STAFF_WAREHOUSE_DOMESTIC":
        return [...baseFields, "department", "location"];
      case "STAFF_PURCHASER":
        return [...baseFields, "department"];
      case "MANAGER":
      case "ADMIN":
        return [...baseFields, "location"];
      case "CUSTOMER":
        return baseFields.filter((field) => field !== "role");
      default:
        return baseFields;
    }
  },

  // Legacy method for backward compatibility
  validateRegistrationData: (data) => {
    return registrationService.validateCustomerRegistrationData(data);
  },
};

export default registrationService;

// Export individual functions for backward compatibility
export const registerCustomer = registrationService.registerCustomer;
export const registerStaff = registrationService.registerStaff;
export const validateRegistrationData =
  registrationService.validateRegistrationData;
export const validateCustomerRegistrationData =
  registrationService.validateCustomerRegistrationData;
export const validateStaffRegistrationData =
  registrationService.validateStaffRegistrationData;
