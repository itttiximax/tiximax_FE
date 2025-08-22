import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
