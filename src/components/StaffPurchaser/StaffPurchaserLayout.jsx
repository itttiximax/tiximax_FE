import React from "react";
import { Outlet } from "react-router-dom";
import StaffPurchaserSidebar from "./StaffPurchaserSidebar";

const StaffPurchaserLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <StaffPurchaserSidebar />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffPurchaserLayout;
