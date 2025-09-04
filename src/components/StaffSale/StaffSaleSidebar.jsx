import React, { useState } from "react";
import {
  BarChart3,
  Users,
  Package,
  Truck,
  Warehouse,
  MapPin,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Phone,
  Calculator,
  ShoppingCart,
  Menu,
  Circle,
} from "lucide-react";

// StaffSaleSidebar Component
const StaffSaleSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openOrders, setOpenOrders] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);
  const [activeItem, setActiveItem] = useState("/staff-sale/dashboard");

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const isActive = (path) => activeItem === path || activeItem.startsWith(path);

  const menuSections = [
    {
      title: "BÁO CÁO",
      items: [
        {
          text: "Thống kê bán hàng",
          icon: BarChart3,
          path: "/staff-sale/dashboard",
          color: "blue",
        },
      ],
    },
    {
      title: "KHÁCH HÀNG",
      items: [
        {
          text: "Danh sách KH",
          icon: Users,
          path: "/staff-sale/customers",
          color: "green",
        },
        {
          text: "Hỗ trợ KH",
          icon: Phone,
          path: "/staff-sale/support",
          color: "green",
        },
      ],
    },
    {
      title: "ĐƠN HÀNG",
      items: [
        {
          text: "Bán hàng",
          icon: ShoppingCart,
          hasSubmenu: true,
          isOpen: openOrders,
          onToggle: () => setOpenOrders(!openOrders),
          color: "purple",
          submenuItems: [
            { text: "Tất cả đơn", path: "/staff-sale/orders" },
            { text: "Chờ xử lý", path: "/staff-sale/orders/pending" },
            { text: "Đang giao", path: "/staff-sale/orders/transit" },
            { text: "Hoàn thành", path: "/staff-sale/orders/delivered" },
          ],
        },
        {
          text: "Báo giá",
          icon: Calculator,
          path: "/staff-sale/quotations",
          color: "purple",
        },
      ],
    },
    {
      title: "VẬN CHUYỂN",
      items: [
        {
          text: "Theo dõi đơn",
          icon: Truck,
          hasSubmenu: true,
          isOpen: openShipping,
          onToggle: () => setOpenShipping(!openShipping),
          color: "orange",
          submenuItems: [
            { text: "Khách lẻ", path: "/staff-sale/shipping/retail" },
            { text: "Khách đại lý", path: "/staff-sale/shipping/wholesale" },
          ],
        },
        {
          text: "Kho hàng",
          icon: Warehouse,
          path: "/staff-sale/warehouses",
          color: "orange",
        },
        {
          text: "Dịch vụ VC",
          icon: MapPin,
          path: "/staff-sale/service-areas",
          color: "orange",
        },
        {
          text: "Khu vực VC",
          icon: Package,
          path: "/staff-sale/areas",
          color: "orange",
        },
      ],
    },
  ];

  const getActiveColor = (color) => {
    const colors = {
      blue: "bg-blue-600 text-white",
      green: "bg-emerald-600 text-white",
      purple: "bg-violet-600 text-white",
      orange: "bg-orange-600 text-white",
    };
    return colors[color] || colors.blue;
  };

  const getHoverColor = (color) => {
    const colors = {
      blue: "hover:bg-blue-50 hover:text-blue-700",
      green: "hover:bg-emerald-50 hover:text-emerald-700",
      purple: "hover:bg-violet-50 hover:text-violet-700",
      orange: "hover:bg-orange-50 hover:text-orange-700",
    };
    return colors[color] || colors.blue;
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;

    if (item.hasSubmenu) {
      const hasActiveSubmenu = item.submenuItems?.some((subItem) =>
        isActive(subItem.path)
      );

      return (
        <div key={item.text} className="mb-1">
          <button
            onClick={item.onToggle}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border text-sm font-medium ${
              hasActiveSubmenu || item.isOpen
                ? getActiveColor(item.color) + " shadow-sm border-transparent"
                : `text-gray-700 bg-white border-gray-200 ${getHoverColor(
                    item.color
                  )} hover:shadow-sm`
            }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.text}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    item.isOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {!isCollapsed && item.isOpen && (
            <div className="mt-1 ml-6 space-y-1">
              {item.submenuItems?.map((subItem) => {
                const subActive = isActive(subItem.path);
                return (
                  <button
                    key={subItem.path}
                    onClick={() => handleItemClick(subItem.path)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                      subActive
                        ? getActiveColor(item.color) + " shadow-sm"
                        : `text-gray-600 bg-gray-50 hover:bg-gray-100 ${getHoverColor(
                            item.color
                          )}`
                    }`}
                  >
                    <Circle size={8} className="flex-shrink-0" />
                    <span className="text-left flex-1">{subItem.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const active = isActive(item.path);

    return (
      <button
        key={item.path}
        onClick={() => handleItemClick(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border text-sm font-medium mb-1 ${
          active
            ? getActiveColor(item.color) + " shadow-sm border-transparent"
            : `text-gray-700 bg-white border-gray-200 ${getHoverColor(
                item.color
              )} hover:shadow-sm`
        }`}
        title={isCollapsed ? item.text : undefined}
      >
        <Icon size={18} className="flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.text}</span>
            {active && <ChevronRight size={16} />}
          </>
        )}
      </button>
    );
  };

  const renderMenuSection = (section) => (
    <div key={section.title} className="mb-6">
      {!isCollapsed && (
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3">
            {section.title}
          </h3>
          <div className="mt-2 h-px bg-gray-200"></div>
        </div>
      )}
      <div className="space-y-1">{section.items.map(renderMenuItem)}</div>
    </div>
  );

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-screen bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Staff Sale</h2>
                <p className="text-xs text-gray-500">Nhân viên bán hàng</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
                <User size={20} className="text-white" />
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            <Menu size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {menuSections.map(renderMenuSection)}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>

        {!isCollapsed && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">Staff v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Layout Component
const StaffSaleLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Responsive Sidebar */}
      <StaffSaleSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content with responsive margins */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100/50 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                {/* Demo content - replace with <Outlet /> in real app */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Dashboard
                    </h1>
                    <div className="text-sm text-gray-500">
                      Sidebar:{" "}
                      {isCollapsed ? "Thu gọn (64px)" : "Mở rộng (256px)"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Thống kê bán hàng
                      </h3>
                      <p className="text-sm text-blue-700">
                        Xem báo cáo chi tiết về doanh số bán hàng
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2">
                        Quản lý khách hàng
                      </h3>
                      <p className="text-sm text-green-700">
                        Theo dõi và hỗ trợ khách hàng hiệu quả
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-2">
                        Đơn hàng
                      </h3>
                      <p className="text-sm text-purple-700">
                        Quản lý đơn hàng và báo giá
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Hướng dẫn sử dụng
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>
                        • Click vào nút Menu (☰) để thu gọn/mở rộng sidebar
                      </li>
                      <li>
                        • Sidebar tự động thay đổi kích thước từ 256px xuống
                        64px
                      </li>
                      <li>• Khi thu gọn, hover vào icon để xem tooltip</li>
                      <li>• Submenu chỉ hiển thị khi sidebar mở rộng</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffSaleLayout;
