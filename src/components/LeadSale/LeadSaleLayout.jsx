import { Outlet } from "react-router-dom";
import LeadSaleSidebar from "./LeadSaleSidebar";

const LeadSaleLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed width to match sidebar component */}
      <div className="w-64 bg-white shadow-sm">
        <LeadSaleSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content with hidden scrollbar */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <div className=" mx-auto">
            {/* Content Container với responsive padding */}
            <div className="bg-white overflow-hidden">
              <div className="p-6 md:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadSaleLayout;
