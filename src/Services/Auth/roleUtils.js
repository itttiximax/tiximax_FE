// src/Services/Auth/roleUtils.js
import { ROLES } from "./authService";

export const getDashboardPathByRole = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin/dashboard";
    case ROLES.MANAGER:
      return "/manager/dashboard";
    case ROLES.LEAD_SALE:
      return "/lead-sale/dashboard";
    case ROLES.STAFF_SALE:
      return "/staff-sale";
    case ROLES.STAFF_PURCHASER:
      return "/staff-purchaser/dashboard";
    case ROLES.STAFF_WAREHOUSE_FOREIGN:
      return "/staff-warehouse-foreign/dashboard";
    case ROLES.STAFF_WAREHOUSE_DOMESTIC:
      return "/staff-warehouse-domestic/dashboard";
    // CUSTOMER hoặc chưa đăng nhập:
    default:
      return "/";
  }
};
