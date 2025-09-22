// import { Outlet } from "react-router-dom";
// import StaffWarehouseForeignSidebar from "./StaffWarehouseForeignSidebar";

// const StaffWarehouseForeignLayout = () => {
//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* Sidebar - Dynamic width to match collapsible sidebar */}
//       <div className="bg-white shadow-sm flex-shrink-0">
//         <StaffWarehouseForeignSidebar />
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden min-w-0">
//         {/* Header Bar - Enhanced Design */}
//         {/* Add header here if needed */}

//         {/* Scrollable Content */}
//         <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
//           <div className="mx-auto max-w-7xl">
//             {/* Content Container với responsive padding */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
//               <div className="p-4 sm:p-6 md:p-8">
//                 <Outlet />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StaffWarehouseForeignLayout;
import { Outlet } from "react-router-dom";
import StaffWarehouseForeignSidebar from "./StaffWarehouseForeignSidebar";

const StaffWarehouseForeignLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed width to match sidebar component */}
      <div className="w-64 bg-white shadow-sm">
        <StaffWarehouseForeignSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar - Enhanced Design */}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
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

export default StaffWarehouseForeignLayout;
