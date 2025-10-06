import { Outlet } from "react-router-dom";
import StaffWarehouseDomesticSidebar from "./StaffWarehouseDomesticSidebar";

const StaffWarehouseDomesticLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-blue-100 border-r border-blue-300 shadow-md">
        <StaffWarehouseDomesticSidebar />
      </div>

      {/* Đường phân cách rõ hơn (một line mảnh màu xám nhạt) */}
      <div className="w-[1px] bg-gray-300"></div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffWarehouseDomesticLayout;
