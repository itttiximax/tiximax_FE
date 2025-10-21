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
import ShipmentTracking from "../components/Admin/ShipmentTracking";
import InventoryList from "../components/Admin/InventoryList";
import RevenueDashboard from "../components/Admin/RevenueDashboard";
import TrackingOrder from "../components/Admin/TrackingOrder";
import EmployeeKPI from "../components/Admin/EmployeeKPI";
import ProfitLoss from "../components/Admin/ProfitLoss";

//LeadSale components
import LeadSaleLayout from "../components/LeadSale/LeadSaleLayout";
import LeadSalePage from "../components/LeadSale/LeadSalePage";
import DashboardLeadSale from "../components/LeadSale/DashboardLeadSale";

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
import NotFound from "../Page/NotFound";
import CreateAccountUser from "../components/StaffSale/CreateAccountUser";
import ProfilePage from "../Page/ProfilePage";
import OrderLinkList from "../components/StaffPurchaser/OrderLinkList";
import CreateAccountStaff from "../components/Admin/CreateAccountStaff";
import AccountSearch from "../components/Order/AccountSearch";
import CreateOrderForm from "../components/Order/CreateOrderForm";
import ManagerWebsite from "../components/Manager/ManagerWebsite";
import WarehouseShipment from "../components/WarehouseForeign/WarehouseShipment";
import WarehouseList from "../components/WarehouseForeign/WarehouseList";
import CreatePacking from "../components/WarehouseForeign/CreatePacking";
import PackingEligibleList from "../components/WarehouseForeign/PackingEligibleList";
import PackingAwaitList from "../components/WarehouseForeign/PackingAwaitList";
import OrderList from "../components/Order/OrderList";
import StaffList from "../components/Manager/StaffList";
import CustomerList from "../components/Manager/CustomerList";
import CustomerStaffList from "../components/StaffSale/CustomerStaffList";
import Permission from "../components/Admin/Permission";
import StaffListPermission from "../components/Manager/StaffListPermission";
import PackingFlyingList from "../components/WarehouseDomestic/PackingFlyingList";
import ExportList from "../components/WarehouseDomestic/ExportList";
import CreateDepositForm from "../components/Order/CreateDepositForm";
import PaymentShipList from "../components/PaymentOrder/PaymentShipList";
import MergedPaymentShip from "../components/PaymentOrder/MergedPaymentShip";
import MergedPaymentOrder from "../components/PaymentOrder/MergedPaymentOrder";
import PaymentOrderList from "../components/PaymentOrder/PaymentOrderList";
import CreateAuctionForm from "../components/Order/CreateAuctionForm";
import OrderAuctionList from "../components/StaffPurchaser/OrderAuctionList";
import AuctionPayment from "../components/PaymentOrder/AuctionPayment";
import ManagerTeam from "../components/LeadSale/ManagerTeam";
import AuthCallback from "../Services/Auth/AuthCallback";
import DashboardPurchase from "../components/StaffPurchaser/DashboardPurchase";
import ImportProduct from "../components/WarehouseForeign/ImportProduct";
import DashboardWarehouse from "../components/WarehouseDomestic/DashboardWarehouse";
import StaffProfile from "../components/common/StaffProfile";
import ManagerPromotion from "../components/Manager/ManagerPromotion";
import ImportPacking from "../components/WarehouseForeign/ImportPacking";
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
      { path: "/auth/callback", element: <AuthCallback /> },
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
      { path: "orders", element: <NotFound /> },
      { path: "products", element: <NotFound /> },
      { path: "staff", element: <Permission /> },
      { path: "customers", element: <NotFound /> },
      { path: "settings", element: <CreateAccountStaff /> },
      { path: "revenue-analytics", element: <RevenueDashboard /> }, // Chua tien khai
      { path: "order-status-overview", element: <TrackingOrder /> },
      { path: "profit-loss", element: <ProfitLoss /> },
      { path: "employee-kpi", element: <EmployeeKPI /> },
      { path: "pending-deliveries", element: <NotFound /> },
      { path: "shipment-tracking", element: <ShipmentTracking /> }, // Chưa triển khai
      { path: "route-planning", element: <NotFound /> },
      { path: "drivers", element: <NotFound /> },
      { path: "vehicles", element: <NotFound /> },
      { path: "inventory", element: <InventoryList /> }, // Chưa triển khai
      { path: "warehouse-transactions", element: <NotFound /> },
      { path: "warehouse-locations", element: <NotFound /> },
      { path: "inventory-reports", element: <NotFound /> },
      { path: "orders/create", element: <NotFound /> },
      { path: "order-processing", element: <NotFound /> },
      { path: "customer-support", element: <NotFound /> },
      { path: "order-history", element: <NotFound /> },
      { path: "work-schedule", element: <NotFound /> },
      { path: "employee-performance", element: <NotFound /> },
      { path: "user-permissions", element: <NotFound /> },
      { path: "financial-overview", element: <NotFound /> },
      { path: "cod-payments", element: <NotFound /> },
      { path: "customer-debts", element: <NotFound /> },
      { path: "financial-reports", element: <NotFound /> },
      { path: "delivery-performance", element: <NotFound /> },
      { path: "fuel-analysis", element: <NotFound /> },
      { path: "maintenance-costs", element: <NotFound /> },
      { path: "top-customers", element: <NotFound /> },
      { path: "shipping-trends", element: <NotFound /> },
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
      { path: "profile", element: <ProfilePage /> },
      { path: "team", element: <StaffList /> },
      { path: "customers", element: <CustomerList /> },
      { path: "permission", element: <Permission /> },
      { path: "stafflead", element: <StaffListPermission /> },
      { path: "createstaff", element: <CreateAccountStaff /> },
      { path: "quote", element: <PaymentOrderList /> },
      { path: "ads", element: <NotFound /> },
      { path: "cost/paylater", element: <NotFound /> },
      { path: "cost/paybefore", element: <NotFound /> },
      { path: "routes", element: <ManagerRoutes /> },
      { path: "transfer", element: <ManagerDestination /> },
      { path: "dashboard", element: <ManagerDashboard /> },
      { path: "producttype", element: <ManagerProductType /> },
      { path: "order", element: <ManagerOrder /> },
      { path: "website", element: <ManagerWebsite /> },
      { path: "promotion", element: <ManagerPromotion /> },
      { path: "notifications", element: <NotFound /> },
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
      { path: "profile", element: <StaffProfile /> },
      { path: "createorder", element: <CreateOrderForm /> },
      { path: "deposit", element: <CreateDepositForm /> },
      { path: "auction", element: <CreateAuctionForm /> },
      { path: "createaccountuser", element: <CreateAccountUser /> },
      { path: "prospects", element: <NotFound /> },
      { path: "dashboard", element: <DashboardLeadSale /> },
      { path: "team", element: <ManagerTeam /> },
      { path: "salesreport", element: <NotFound /> },
      { path: "team-performance", element: <NotFound /> },
      { path: "customers", element: <CustomerStaffList /> },
      { path: "orders", element: <OrderList /> },
      { path: "/lead-sale/shipping/domestic", element: <NotFound /> },
      { path: "/lead-sale/shipping/international", element: <NotFound /> },
      { path: "tracking", element: <NotFound /> },
      { path: "orders/tracking", element: <ManagerOrder /> },
      { path: "order-payment", element: <PaymentOrderList /> },
      { path: "ship-payment", element: <PaymentShipList /> },
      { path: "auction-payment", element: <AuctionPayment /> },
      { path: "createpaymentsupport", element: <MergedPaymentOrder /> },
      { path: "createpaymentshipping", element: <MergedPaymentShip /> },
      { path: "warehouse-staff", element: <NotFound /> },
      { path: "sales-staff", element: <NotFound /> },
      { path: "schedule", element: <NotFound /> },
      { path: "destination", element: <NotFound /> },
      { path: "campaigns", element: <SearchWebsite /> },
      { path: "camp", element: <AccountSearch /> },
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
      { path: "profile", element: <StaffProfile /> },
      { path: "create-invoice", element: <CreateOrderForm /> },
      { path: "quotations", element: <PaymentOrderList /> },
      { path: "deposit", element: <CreateDepositForm /> },
      { path: "auction", element: <CreateAuctionForm /> },
      { path: "order-payment", element: <PaymentOrderList /> },
      { path: "ship-payment", element: <PaymentShipList /> },
      { path: "createpaymentsupport", element: <MergedPaymentOrder /> },
      { path: "createpaymentshipping", element: <MergedPaymentShip /> },
      { path: "orders/pending", element: <ManagerOrder /> },
      { path: "createaccountuser", element: <CreateAccountUser /> },
      { path: "customers", element: <CustomerStaffList /> },
      { path: "auction-payment", element: <AuctionPayment /> },
      { path: "prospects", element: <NotFound /> },
      { path: "orders", element: <NotFound /> },
      { path: "orders/pending", element: <NotFound /> }, // Chưa triển khai
      { path: "shipping/domestic", element: <NotFound /> }, // Chưa triển khai
      { path: "shipping/international", element: <NotFound /> }, // Chưa triển khai
      { path: "tracking", element: <Tracking /> }, // Chưa triển khai
      { path: "warehouses", element: <Tracking /> }, // Chưa triển khai
      { path: "telesale", element: <NotFound /> }, // Chưa triển khai
      { path: "knowledge", element: <NotFound /> }, // Chưa triển khai
      { path: "schedule", element: <NotFound /> }, // Chưa triển khai
      { path: "dashboard", element: <NotFound /> },
      { path: "performance", element: <NotFound /> },
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
      { path: "profile", element: <StaffProfile /> },
      { path: "dashboard", element: <DashboardPurchase /> },
      { path: "orders", element: <OrderLinkList /> },
      { path: "auction", element: <OrderAuctionList /> },
      { path: "inventory", element: <NotFound /> },
      { path: "inventory/audit", element: <NotFound /> },
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
      { path: "profile", element: <StaffProfile /> },
      { path: "dashboard", element: <DashboardWarehouse /> },
      { path: "warehouse", element: <WarehouseList /> },
      { path: "importproduct", element: <ImportPacking /> },
      { path: "imports", element: <WarehouseShipment /> },
      { path: "packings", element: <CreatePacking /> },
      { path: "outbound/packingeligible", element: <PackingEligibleList /> },
      { path: "outbound/packingawaiting", element: <PackingAwaitList /> },
      { path: "outbound/orders", element: <NotFound /> },
      { path: "outbound/packinginwarehouse", element: <NotFound /> },
      { path: "stock/serial", element: <NotFound /> },
      { path: "stock/location", element: <NotFound /> },
      { path: "audit/check", element: <ImportProduct /> },
      { path: "audit/reconcile", element: <NotFound /> },
      { path: "reports/dashboard", element: <NotFound /> },
      { path: "reports/performance", element: <NotFound /> },
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
      { path: "profile", element: <StaffProfile /> },
      { path: "dashboard", element: <DashboardWarehouse /> },
      { path: "inventory", element: <NotFound /> },
      { path: "imports", element: <PackingFlyingList /> },
      { path: "exports", element: <ExportList /> },
      { path: "eligible-packings", element: <PackingEligibleList /> },
      { path: "inventory-check", element: <NotFound /> },
      { path: "product-search", element: <NotFound /> },
      { path: "reports", element: <NotFound /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default Router;
