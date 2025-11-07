// src/Router/DenyRoles.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../Services/Auth/authService"; // tuỳ file export của bạn
import { getDashboardPathByRole } from "../Services/Auth/roleUtils";

/**
 * Cấm các role trong mảng `denied` truy cập.
 * Nếu user.role thuộc denied -> redirect về dashboard theo role.
 */
const DenyRoles = ({ denied = [], children }) => {
  const location = useLocation();
  const user = getCurrentUser?.(); // { role, ... } hoặc null

  if (user?.role && denied.includes(user.role)) {
    const redirectTo = getDashboardPathByRole(user.role);
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
    // replace: tránh giữ lại history của trang bị cấm
  }

  return children;
};

export default DenyRoles;
