import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar: width 256px (w-64) để match với sidebar component */}
      <div className="flex-shrink-0 w-64">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content: scrollable area with hidden scrollbar */}
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Content container with proper spacing */}
          <div className="min-h-full">
            <div className="p-6">
              {/* Outlet wrapper with enhanced styling */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-yellow-500/10 shadow-2xl">
                <div className="p-6">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
