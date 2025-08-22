// src/Router/Router.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Page/Layout";
import SignIn from "../Page/SignIn";
import SignUp from "../Page/SignUp";
import ForgotPassword from "../Page/ForgotPassword";
import Home from "../Page/Home";

import AdminPage from "../components/Admin/AdminPage";
import ManagerPage from "../components/Manager/ManagerPage";
import LeadSalePage from "../components/LeadSale/LeadSalePage";
import StaffSalePage from "../components/StaffSale/StaffSalePage";
import StaffPurchaserPage from "../components/StaffPurchaser/StaffPurchaserPage";
import StaffWarehouseForeignPage from "../components/WarehouseForeign/StaffWarehouseForeignPage";
import StaffWarehouseDomesticPage from "../components/WarehouseDomestic/StaffWarehouseDomesticPage";
// import CustomerPage from "../Page/CustomerPage";

import ProtectedRoute from "../Router/ProtectedRoute";
import { ROLES } from "../Services/authService";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "home", element: <Home /> },

      // --- Các route phân quyền ---
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "manager",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
            <ManagerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "lead-sale",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.LEAD_SALE]}>
            <LeadSalePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff-sale",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF_SALE]}>
            <StaffSalePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff-purchaser",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF_PURCHASER]}>
            <StaffPurchaserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff-warehouse-foreign",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF_WAREHOUSE_FOREIGN]}>
            <StaffWarehouseForeignPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff-warehouse-domestic",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF_WAREHOUSE_DOMESTIC]}>
            <StaffWarehouseDomesticPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "customer",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
            <CustomerPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default Router;
