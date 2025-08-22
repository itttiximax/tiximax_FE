// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/signin" replace />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../Services/authService";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
