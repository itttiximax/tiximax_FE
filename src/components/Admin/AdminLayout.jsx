import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar với hamburger button đã được tích hợp bên trong AdminSidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content: scrollable area with hidden scrollbar */}
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Content container with proper spacing */}
          <div className="mx-auto">
            {/* Outlet wrapper with enhanced styling */}
            <div className="bg-black/20 backdrop-blur-sm overflow-hidden">
              {/* Thêm padding top trên mobile để tránh hamburger button */}
              <div className="p-6 md:p-8 pt-20 lg:pt-6">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
