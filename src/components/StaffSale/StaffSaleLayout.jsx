import { Outlet } from "react-router-dom";
import StaffSaleSidebar from "./StaffSaleSidebar";

const StaffSaleLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Bỏ width cố định để sidebar tự điều chỉnh */}
      <div className="bg-white shadow-sm border-r border-gray-200">
        <StaffSaleSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content with hidden scrollbar */}
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="mx-auto">
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

export default StaffSaleLayout;
