import React from "react";
import { Truck, MapPin, Clock, CheckCircle } from "lucide-react";

const ShipmentTracking = () => {
  const shipmentData = [
    {
      id: "SH001",
      customer: "Nguyễn Văn A",
      destination: "Hà Nội",
      status: "Đang xử lý",
      estimatedDelivery: "2025-09-28",
      icon: <Clock />,
      path: "/admin/shipments/SH001",
      ariaLabel: "Xem chi tiết lô hàng SH001",
    },
    {
      id: "SH002",
      customer: "Trần Thị B",
      destination: "TP. Hồ Chí Minh",
      status: "Đang giao",
      estimatedDelivery: "2025-09-27",
      icon: <Truck />,
      path: "/admin/shipments/SH002",
      ariaLabel: "Xem chi tiết lô hàng SH002",
    },
    {
      id: "SH003",
      customer: "Lê Văn C",
      destination: "Đà Nẵng",
      status: "Đã giao",
      estimatedDelivery: "2025-09-25",
      icon: <CheckCircle />,
      path: "/admin/shipments/SH003",
      ariaLabel: "Xem chi tiết lô hàng SH003",
    },
    {
      id: "SH004",
      customer: "Phạm Thị D",
      destination: "Cần Thơ",
      status: "Đang xử lý",
      estimatedDelivery: "2025-09-29",
      icon: <Clock />,
      path: "/admin/shipments/SH004",
      ariaLabel: "Xem chi tiết lô hàng SH004",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-yellow-300">
            Theo Dõi Lô Hàng
          </h1>
          <p className="text-gray-300 text-sm mt-3">
            Theo dõi trạng thái và chi tiết các lô hàng của bạn
          </p>
        </header>

        {/* Shipment List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipmentData.map((shipment) => (
            <button
              key={shipment.id}
              onClick={() => (window.location.href = shipment.path)}
              className="bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-5 text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              aria-label={shipment.ariaLabel}
            >
              <div className="flex items-center space-x-4">
                {React.cloneElement(shipment.icon, {
                  className: "w-8 h-8 text-yellow-400",
                })}
                <div>
                  <h2 className="text-sm font-semibold uppercase text-gray-300">
                    Lô hàng {shipment.id}
                  </h2>
                  <p className="text-lg font-bold text-yellow-400 mt-1">
                    {shipment.status}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Khách hàng: {shipment.customer}
                  </p>
                  <p className="text-sm text-gray-400">
                    Điểm đến: {shipment.destination}
                  </p>
                  <p className="text-sm text-gray-400">
                    Dự kiến giao: {shipment.estimatedDelivery}
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
              onClick={() => (window.location.href = "/admin/shipments/new")}
              aria-label="Tạo lô hàng mới"
            >
              Tạo Lô Hàng Mới
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/shipments/pending")
              }
              aria-label="Xem lô hàng đang xử lý"
            >
              Lô Hàng Đang Xử Lý
            </button>
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 px-8 py-4 rounded-lg text-black font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              onClick={() =>
                (window.location.href = "/admin/shipments/delivered")
              }
              aria-label="Xem lô hàng đã giao"
            >
              Lô Hàng Đã Giao
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShipmentTracking;
