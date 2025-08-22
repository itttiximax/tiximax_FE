import React from "react";
import { Outlet } from "react-router-dom";
import LeadSaleSidebar from "./LeadSaleSidebar";

const LeadSaleLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <LeadSaleSidebar />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default LeadSaleLayout;
