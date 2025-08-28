import { Outlet } from "react-router-dom";
import ManagerSidebar from "./ManagerSidebar";

const ManagerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Modern Sidebar */}
      <div className="w-72 bg-white border-r border-gray-100 shadow-xl">
        <ManagerSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable Content with improved styling */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50 p-8">
          <div className=" mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
