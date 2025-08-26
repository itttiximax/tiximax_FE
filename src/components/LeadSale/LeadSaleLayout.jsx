import { Outlet } from "react-router-dom";
import LeadSaleSidebar from "./LeadSaleSidebar";

const LeadSaleLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar: Fixed width, full height, scrollable if needed */}
      <div className="flex-shrink-0">
        <LeadSaleSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LeadSaleLayout;
