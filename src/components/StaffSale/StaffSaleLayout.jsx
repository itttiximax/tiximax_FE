import { Outlet } from "react-router-dom";
import StaffSaleSidebar from "./StaffSaleSidebar";

const StaffSaleLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed width to match sidebar component */}
      <div className="w-64 bg-white shadow-sm">
        <StaffSaleSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar - Enhanced Design */}

        {/* Scrollable Content with hidden scrollbar */}
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
          <div className=" mx-auto">
            {/* Content Container với responsive padding */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
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

export default StaffSaleLayout;
