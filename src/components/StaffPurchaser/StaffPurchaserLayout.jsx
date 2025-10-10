import { Outlet } from "react-router-dom";
import StaffPurchaserSidebar from "./StaffPurchaserSidebar";

const StaffPurchaserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Bỏ width cố định để sidebar tự điều chỉnh */}
      <div className="bg-white border-r shadow-md">
        <StaffPurchaserSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffPurchaserLayout;
