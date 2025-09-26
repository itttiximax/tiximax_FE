import React from "react";
import { Package, AlertTriangle, PlusCircle, Warehouse } from "lucide-react";

const InventoryList = () => {
  const inventoryData = [
    {
      id: "INV001",
      name: "Laptop Dell XPS 13",
      category: "Điện tử",
      quantity: 25,
      status: "Còn hàng",
      icon: <Package />,
      path: "/admin/inventory/INV001",
      ariaLabel: "Xem chi tiết mặt hàng INV001",
    },
    {
      id: "INV002",
      name: "Tai nghe Sony WH-1000XM5",
      category: "Phụ kiện",
      quantity: 8,
      status: "Sắp hết",
      icon: <AlertTriangle />,
      path: "/admin/inventory/INV002",
      ariaLabel: "Xem chi tiết mặt hàng INV002",
    },
    {
      id: "INV003",
      name: "Bàn phím cơ Keychron K8",
      category: "Phụ kiện",
      quantity: 0,
      status: "Hết hàng",
      icon: <AlertTriangle />,
      path: "/admin/inventory/INV003",
      ariaLabel: "Xem chi tiết mặt hàng INV003",
    },
    {
      id: "INV004",
      name: "Màn hình LG UltraWide",
      category: "Điện tử",
      quantity: 15,
      status: "Còn hàng",
      icon: <Package />,
      path: "/admin/inventory/INV004",
      ariaLabel: "Xem chi tiết mặt hàng INV004",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-yellow-300">
            Danh Sách Kho Hàng
          </h1>
          <p className="text-gray-300 text-sm mt-3">
            Quản lý và theo dõi tồn kho của bạn
          </p>
        </header>

        {/* Inventory List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryData.map((item) => (
            <button
              key={item.id}
              onClick={() => (window.location.href = item.path)}
              className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              aria-label={item.ariaLabel}
            >
              <div className="flex items-center space-x-4">
                {React.cloneElement(item.icon, {
                  className: `w-8 h-8 ${
                    item.status === "Hết hàng" || item.status === "Sắp hết"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`,
                })}
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-300">
                    {item.name} ({item.id})
                  </h2>
                  <p className="text-lg font-bold text-yellow-400 mt-1">
                    {item.status}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Danh mục: {item.category}
                  </p>
                  <p className="text-sm text-gray-400">
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-6">
            Tác Vụ Nhanh
          </h2>
          <div className="flex flex-wrap gap-5">
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() => (window.location.href = "/admin/inventory/new")}
              aria-label="Thêm mặt hàng mới"
            >
              Thêm Mặt Hàng Mới
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/inventory/low-stock")
              }
              aria-label="Xem mặt hàng sắp hết"
            >
              Mặt Hàng Sắp Hết
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/inventory/restock")
              }
              aria-label="Cập nhật kho hàng"
            >
              Cập Nhật Kho Hàng
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InventoryList;
