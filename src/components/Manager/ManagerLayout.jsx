import React from "react";
import { Outlet } from "react-router-dom";
import ManagerSidebar from "./ManagerSideBar";

const ManagerLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <ManagerSidebar />
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
