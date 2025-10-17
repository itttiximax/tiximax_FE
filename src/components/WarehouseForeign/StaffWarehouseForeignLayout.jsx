import { Outlet } from "react-router-dom";
import StaffWarehouseForeignSidebar from "./StaffWarehouseForeignSidebar";

const StaffWarehouseForeignLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Bỏ width cố định để sidebar tự điều chỉnh */}
      <div className="bg-blue-100 shadow-md">
        <StaffWarehouseForeignSidebar />
      </div>

      {/* Black dividing line between Sidebar and Main Content */}
      <div className="w-[1px] bg-gray-300"></div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="mx-auto">
            {/* Content Container */}
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

export default StaffWarehouseForeignLayout;
