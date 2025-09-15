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

export default StaffSaleLayout;

// <header className="bg-white border-b border-gray-200/80 shadow-lg backdrop-blur-sm px-6 py-5">
//   <div className="flex items-center justify-between">
//     <div className="flex items-center gap-6">
//       {/* Welcome Message */}
//       <div className="flex flex-col">
//         {/* <h2 className="text-lg font-semibold text-pink-800">
//           Chào mừng bạn đã trở thành 1 thành viên của tư bản 👋
//         </h2>
//         <p className="text-sm text-red-500">
//           Quản lý công việc của bạn hiệu quả hơn là nhờ LE THINH PHAT
//         </p> */}
//       </div>
//     </div>

//     {/* Right Side - Date & Status */}
//     <div className="flex items-center gap-6 ">
//       {/* Current Date with Icon */}
//       <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 rounded-xl border border-blue-100">
//         <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//         <div className="text-sm font-medium text-gray-700">
//           {new Date().toLocaleDateString("vi-VN", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </div>
//       </div>

//       {/* Status Badge */}
//       <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
//         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//         <span className="text-xs font-medium text-green-700">
//           Online
//         </span>
//       </div>
//     </div>
//   </div>
// </header>;
