import React from "react";
import { Outlet } from "react-router-dom";
import StaffPurchaserSidebar from "./StaffPurchaserSidebar";

const StaffWarehouseDomesticLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <StaffPurchaserSidebar />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffWarehouseDomesticLayout;
