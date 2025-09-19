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
import StaffList from "../components/Admin/StaffList";
import CustomerList from "../components/Admin/CustomerList";

//LeadSale components
import LeadSaleLayout from "../components/LeadSale/LeadSaleLayout";
import LeadSalePage from "../components/LeadSale/LeadSalePage";
import DashboardLeadSale from "../components/LeadSale/DashboardLeadSale";
// import CreatePayment from "../components/LeadSale/CreatePayment";

import SearchWebsite from "../components/Order/SearchWebsite";

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
import Tracking from "../components/StaffSale/Tracking";
import CreateOrderPayment from "../components/PaymentOrder/CreateOrderPayment";

//StaffPurchaser components
import StaffPurchaserPage from "../components/StaffPurchaser/StaffPurchaserPage";
import StaffPurchaserLayout from "../components/StaffPurchaser/StaffPurchaserLayout";

//Manager components
import ManagerLayout from "../components/Manager/ManagerLayout";
import ManagerRoutes from "../components/Manager/ManagerRoutes";
import ManagerDestination from "../components/Manager/ManagerDestination";
import ManagerProductType from "../components/Manager/ManagerProductType";

//Protected Route
import ProtectedRoute from "../Router/ProtectedRoute";
import { ROLES } from "../Services/Auth/authService";
import ManagerOrder from "../components/Manager/ManagerOrder";
import UploadImage from "../components/UploadImage";
import NotFound from "../Page/NotFound";
import CreateAccountUser from "../components/StaffSale/CreateAccountUser";
import ProfilePage from "../Page/ProfilePage";
import OrderLinkList from "../components/StaffPurchaser/OrderLinkList";
import CreateAccountStaff from "../components/Admin/CreateAccountStaff";
import AccountSearch from "../components/Order/AccountSearch";
import CreateOrderPaymentList from "../components/PaymentOrder/CreateOrderPaymentList";
import CreateOrderForm from "../components/Order/CreateOrderForm";
import OrderCustomerList from "../components/Order/OrderCustomerList";
import ManagerWebsite from "../components/Manager/ManagerWebsite";
import WarehouseShipment from "../components/WarehouseForeign/WarehouseShipment";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "profile", element: <ProfilePage /> },
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
      { path: "orders", element: <CreateOrderPayment /> },
      { path: "staff", element: <StaffList /> },
      { path: "customers", element: <CustomerList /> },
      { path: "createaccount", element: <CreateAccountStaff /> },
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
      { path: "team", element: <NotFound /> },
      { path: "customers", element: <NotFound /> },
      { path: "quote", element: <NotFound /> },
      { path: "ads", element: <NotFound /> },
      { path: "cost/paylater", element: <NotFound /> },
      { path: "cost/paybefore", element: <NotFound /> },
      { path: "routes", element: <ManagerRoutes /> },
      { path: "transfer", element: <ManagerDestination /> },
      { path: "dashboard", element: <ManagerDashboard /> },
      { path: "producttype", element: <ManagerProductType /> },
      { path: "order", element: <ManagerOrder /> },
      { path: "website", element: <ManagerWebsite /> },
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
      { path: "createorder", element: <CreateOrderForm /> },
      { path: "dashboard", element: <DashboardLeadSale /> },
      { path: "team", element: <NotFound /> },
      { path: "salesreport", element: <NotFound /> },
      { path: "team-performance", element: <NotFound /> },
      { path: "customers", element: <NotFound /> },
      { path: "orders", element: <ManagerOrder /> },
      { path: "orders/tracking", element: <ManagerOrder /> },
      { path: "createpayment", element: <CreateOrderPaymentList /> },
      { path: "createpaymentsupport", element: <OrderCustomerList /> },
      { path: "warehouse-staff", element: <NotFound /> },
      { path: "sales-staff", element: <NotFound /> },
      { path: "schedule", element: <NotFound /> },
      { path: "destination", element: <NotFound /> },
      { path: "img", element: <UploadImage /> },
      { path: "campaigns", element: <SearchWebsite /> },
      { path: "camp", element: <AccountSearch /> },

      // { path: "trackingpayment", element: <CreateOrderPayment /> },
      // { path: "search", element: <AccountSearch /> },
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
      { path: "create-invoice", element: <CreateOrderForm /> },
      { path: "quotations", element: <CreateOrderPaymentList /> },
      { path: "dashboard", element: <ManagerOrder /> },
      { path: "performance", element: <NotFound /> }, // Chưa triển khai
      { path: "customers", element: <NotFound /> }, // Chưa triển khai
      { path: "prospects", element: <NotFound /> }, // Chưa triển khai
      { path: "createaccountuser", element: <CreateAccountUser /> },
      { path: "orders", element: <NotFound /> }, // Chưa triển khai
      { path: "orders/pending", element: <NotFound /> }, // Chưa triển khai
      { path: "shipping/domestic", element: <NotFound /> }, // Chưa triển khai
      { path: "shipping/international", element: <NotFound /> }, // Chưa triển khai
      { path: "tracking", element: <Tracking /> },
      { path: "warehouses", element: <Tracking /> },
      { path: "telesale", element: <NotFound /> }, // Chưa triển khai
      { path: "knowledge", element: <NotFound /> }, // Chưa triển khai
      { path: "schedule", element: <NotFound /> }, // Chưa triển khai
      { path: "createaccountuser", element: <CreateAccountUser /> },
    ],
  },
  {
    path: "/staff-purchaser",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_PURCHASER]}>
        <StaffPurchaserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StaffPurchaserPage />,
      },
      { path: "dashboard", element: <NotFound /> },
      { path: "orders", element: <OrderLinkList /> },
      { path: "suppliers", element: <NotFound /> },
      { path: "inventory", element: <NotFound /> },
    ],
  },
  {
    path: "/staff-warehouse-foreign",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_WAREHOUSE_FOREIGN]}>
        <StaffWarehouseForeignLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StaffWarehouseForeignPage /> },
      { path: "dashboard", element: <NotFound /> },
      { path: "inventory", element: <WarehouseShipment /> },
      { path: "import", element: <NotFound /> },
      { path: "export", element: <NotFound /> },
    ],
  },
  {
    path: "/staff-warehouse-domestic",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STAFF_WAREHOUSE_DOMESTIC]}>
        <StaffWarehouseDomesticLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StaffWarehouseDomesticPage /> },
      { path: "dashboard", element: <NotFound /> },
      { path: "inventory", element: <NotFound /> },
      { path: "imports", element: <NotFound /> },
      { path: "exports", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
