// src/Router/Router.jsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Page/Layout";
import SignIn from "../Page/SignIn";
import SignUp from "../Page/SignUp";
import ForgotPassword from "../Page/ForgotPassword";
import Home from "../Page/Home";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminPage from "../components/Admin/AdminPage";
import LeadSaleLayout from "../components/LeadSale/LeadSaleLayout";
import DashboardLeadSale from "../components/LeadSale/DashboardLeadSale";
import StaffWarehouseForeignLayout from "../components/WarehouseForeign/StaffWarehouseForeignLayout";
import StaffWarehouseDomesticLayout from "../components/WarehouseDomestic/StaffWarehouseDomesticLayout";
// import UserList from "../components/Admin/UserList";
import ManagerPage from "../components/Manager/ManagerPage";
import LeadSalePage from "../components/LeadSale/LeadSalePage";
import StaffSalePage from "../components/StaffSale/StaffSalePage";
import StaffPurchaserPage from "../components/StaffPurchaser/StaffPurchaserPage";
import StaffWarehouseForeignPage from "../components/WarehouseForeign/StaffWarehouseForeignPage";
import StaffWarehouseDomesticPage from "../components/WarehouseDomestic/StaffWarehouseDomesticPage";
import ManagerLayout from "../components/Manager/ManagerLayout";
import ProtectedRoute from "../Router/ProtectedRoute";
import ManagerTeam from "../components/LeadSale/ManagerTeam";
import { ROLES } from "../Services/authService";
import NotFound from "../Page/NotFound";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "home", element: <Home /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminPage /> }, // index route cho /admin
      // { path: "users", element: <UserList /> },
    ],
  },
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.MANAGER]}>
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ManagerPage /> },
      { path: "team", element: <ManagerTeam /> },
    ],
  },
  {
    path: "/lead-sale",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.LEAD_SALE]}>
        <LeadSaleLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LeadSalePage />,
      },
      { path: "dashboard", element: <DashboardLeadSale /> },
    ],
  },
  {
    path: "/staff-sale",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_SALE]}>
        <StaffSalePage />
      </ProtectedRoute>
    ),
    children: [],
  },
  {
    path: "/staff-purchaser",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_PURCHASER]}>
        <StaffPurchaserPage />
      </ProtectedRoute>
    ),
    children: [],
  },
  {
    path: "/staff-warehouse-foreign",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_WAREHOUSE_FOREIGN]}>
        <StaffWarehouseForeignLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <StaffWarehouseForeignPage /> }],
  },
  {
    path: "/staff-warehouse-domestic",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_WAREHOUSE_DOMESTIC]}>
        <StaffWarehouseDomesticLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <StaffWarehouseDomesticPage /> }],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
