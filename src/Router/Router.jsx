// src/Router/Router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Page/Layout";
import SignIn from "../Page/SignIn";
import SignUp from "../Page/SignUp";
import ForgotPassword from "../Page/ForgotPassword";

// Customer components
import Home from "../Page/Home";

//Admin compoenents
import AdminLayout from "../components/Admin/AdminLayout";
import AdminPage from "../components/Admin/AdminPage";
import AdminDashboard from "../components/Admin/AdminDashboard";
import OrderList from "../components/Admin/OrderList";
import StaffList from "../components/Admin/StaffList";
import CustomerList from "../components/Admin/CustomerList";
//LeadSale components
import LeadSaleLayout from "../components/LeadSale/LeadSaleLayout";
import LeadSalePage from "../components/LeadSale/LeadSalePage";
import CreateOrder from "../components/LeadSale/CreateOrder";
import DashboardLeadSale from "../components/LeadSale/DashboardLeadSale";
import CreatePayment from "../components/LeadSale/CreatePayment";

//StaffWarehouseForeign components
import StaffWarehouseForeignLayout from "../components/WarehouseForeign/StaffWarehouseForeignLayout";
import StaffWarehouseForeignPage from "../components/WarehouseForeign/StaffWarehouseForeignPage";

//StaffWarehouseDomestic components
import StaffWarehouseDomesticLayout from "../components/WarehouseDomestic/StaffWarehouseDomesticLayout";
import StaffWarehouseDomesticPage from "../components/WarehouseDomestic/StaffWarehouseDomesticPage";

//Manager components
import ManagerPage from "../components/Manager/ManagerPage";
import ManagerDashboard from "../components/Manager/ManagerDashboard";

//StaffSale components
import StaffSalePage from "../components/StaffSale/StaffSalePage";
import StaffSaleLayout from "../components/StaffSale/StaffSaleLayout";

//StaffPurchaser components
import StaffPurchaserPage from "../components/StaffPurchaser/StaffPurchaserPage";

//Manager components
import ManagerLayout from "../components/Manager/ManagerLayout";
import ManagerTeam from "../components/LeadSale/ManagerTeam";
import ManagerRoutes from "../components/Manager/ManagerRoutes";
import ManagerDestination from "../components/Manager/ManagerDestination";
import ManagerProductType from "../components/Manager/ManagerProductType";
//Protected Route
import ProtectedRoute from "../Router/ProtectedRoute";
import { ROLES } from "../Services/Auth/authService";
import NotFound from "../Page/NotFound";
import ManagerOrder from "../components/Manager/ManagerOrder";
import UploadImage from "../components/UploadImage";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
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
      { index: true, element: <AdminPage /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "orders", element: <OrderList /> },
      { path: "staff", element: <StaffList /> },
      { path: "customers", element: <CustomerList /> },
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
      { path: "routes", element: <ManagerRoutes /> },
      { path: "transfer", element: <ManagerDestination /> },
      { path: "dashboard", element: <ManagerDashboard /> },
      { path: "producttype", element: <ManagerProductType /> },
      { path: "order", element: <ManagerOrder /> },
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
      { path: "team", element: <DashboardLeadSale /> },
      { path: "salesreport", element: <DashboardLeadSale /> },
      { path: "createorder", element: <CreateOrder /> },
      { path: "createpayment", element: <CreatePayment /> },
      { path: "img", element: <UploadImage /> },
    ],
  },
  {
    path: "/staff-sale",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_SALE]}>
        <StaffSaleLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StaffSalePage />,
      },
      { path: "dashboard", element: <ManagerOrder /> },
      { path: "sale", element: <CreateOrder /> },
      { path: "customers", element: <CustomerList /> },
      { path: "support", element: <CustomerList /> },
    ],
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
