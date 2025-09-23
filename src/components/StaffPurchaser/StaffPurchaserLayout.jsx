import { Outlet } from "react-router-dom";
import StaffPurchaserSidebar from "./StaffPurchaserSidebar";

const StaffPurchaserLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: chiều cao tự động, không scroll riêng */}
      <div className="w-64 bg-white border-r shadow-md">
        <StaffPurchaserSidebar />
      </div>

      {/* Main content: scroll riêng nếu nội dung dài với hidden scrollbar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffPurchaserLayout;
