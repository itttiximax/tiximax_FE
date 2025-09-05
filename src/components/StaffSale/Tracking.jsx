import React, { useState } from "react";
import {
  FaSearch,
  FaBox,
  FaTruck,
  FaPlane,
  FaWarehouse,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaEye,
  FaDownload,
  FaFilter,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock tracking data
  const trackingData = [
    {
      id: "ORD001",
      customerName: "Nguyễn Văn An",
      product: "iPhone 15 Pro Max",
      status: "In Transit",
      currentLocation: "Warehouse Hà Nội",
      estimatedDelivery: "2024-09-10",
      trackingCode: "TRK12345678",
      route: "US → VN → HN",
      progress: 75,
      timeline: [
        {
          status: "Order Placed",
          date: "2024-09-01",
          location: "Online",
          completed: true,
        },
        {
          status: "Processing",
          date: "2024-09-02",
          location: "US Warehouse",
          completed: true,
        },
        {
          status: "Shipped",
          date: "2024-09-03",
          location: "Los Angeles",
          completed: true,
        },
        {
          status: "In Transit",
          date: "2024-09-06",
          location: "Hà Nội Warehouse",
          completed: true,
        },
        {
          status: "Out for Delivery",
          date: "2024-09-10",
          location: "Local Hub",
          completed: false,
        },
        {
          status: "Delivered",
          date: "2024-09-10",
          location: "Customer Address",
          completed: false,
        },
      ],
    },
    {
      id: "ORD002",
      customerName: "Trần Thị Bình",
      product: "MacBook Air M3",
      status: "Processing",
      currentLocation: "US Warehouse",
      estimatedDelivery: "2024-09-15",
      trackingCode: "TRK23456789",
      route: "US → VN → HCM",
      progress: 25,
      timeline: [
        {
          status: "Order Placed",
          date: "2024-09-05",
          location: "Online",
          completed: true,
        },
        {
          status: "Processing",
          date: "2024-09-06",
          location: "US Warehouse",
          completed: true,
        },
        { status: "Shipped", date: "", location: "", completed: false },
        { status: "In Transit", date: "", location: "", completed: false },
        {
          status: "Out for Delivery",
          date: "",
          location: "",
          completed: false,
        },
        { status: "Delivered", date: "", location: "", completed: false },
      ],
    },
    {
      id: "ORD003",
      customerName: "Lê Minh Châu",
      product: "AirPods Pro 2",
      status: "Delivered",
      currentLocation: "Delivered",
      estimatedDelivery: "2024-09-01",
      trackingCode: "TRK34567890",
      route: "US → VN → DN",
      progress: 100,
      timeline: [
        {
          status: "Order Placed",
          date: "2024-08-25",
          location: "Online",
          completed: true,
        },
        {
          status: "Processing",
          date: "2024-08-26",
          location: "US Warehouse",
          completed: true,
        },
        {
          status: "Shipped",
          date: "2024-08-27",
          location: "Los Angeles",
          completed: true,
        },
        {
          status: "In Transit",
          date: "2024-08-30",
          location: "Đà Nẵng Hub",
          completed: true,
        },
        {
          status: "Out for Delivery",
          date: "2024-09-01",
          location: "Local Delivery",
          completed: true,
        },
        {
          status: "Delivered",
          date: "2024-09-01",
          location: "Customer Address",
          completed: true,
        },
      ],
    },
    {
      id: "ORD004",
      customerName: "Phạm Quốc Đạt",
      product: "iPad Pro 12.9",
      status: "Delayed",
      currentLocation: "Customs",
      estimatedDelivery: "2024-09-12",
      trackingCode: "TRK45678901",
      route: "US → VN → HCM",
      progress: 60,
      timeline: [
        {
          status: "Order Placed",
          date: "2024-08-28",
          location: "Online",
          completed: true,
        },
        {
          status: "Processing",
          date: "2024-08-29",
          location: "US Warehouse",
          completed: true,
        },
        {
          status: "Shipped",
          date: "2024-08-30",
          location: "Los Angeles",
          completed: true,
        },
        {
          status: "In Transit",
          date: "2024-09-04",
          location: "Customs Clearance",
          completed: true,
        },
        {
          status: "Out for Delivery",
          date: "",
          location: "",
          completed: false,
        },
        { status: "Delivered", date: "", location: "", completed: false },
      ],
    },
  ];

  // Filter orders
  const filteredOrders = trackingData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    const iconMap = {
      Processing: <FaClock className="text-yellow-500" />,
      "In Transit": <FaTruck className="text-blue-500" />,
      Delivered: <FaCheckCircle className="text-green-500" />,
      Delayed: <FaExclamationTriangle className="text-red-500" />,
    };
    return iconMap[status] || <FaBox className="text-gray-500" />;
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Processing: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "In Transit": "bg-blue-100 text-blue-700 border-blue-200",
      Delivered: "bg-green-100 text-green-700 border-green-200",
      Delayed: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        <div className="mr-2">{getStatusIcon(status)}</div>
        {status}
      </span>
    );
  };

  const getProgressColor = (status) => {
    const colorMap = {
      Processing: "bg-yellow-500",
      "In Transit": "bg-blue-500",
      Delivered: "bg-green-500",
      Delayed: "bg-red-500",
    };
    return colorMap[status] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Theo Dõi Đơn Hàng
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Theo dõi trạng thái và vị trí các đơn hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {trackingData.filter((o) => o.status === "Processing").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang vận chuyển</p>
              <p className="text-2xl font-bold text-blue-600">
                {trackingData.filter((o) => o.status === "In Transit").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaTruck className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã giao</p>
              <p className="text-2xl font-bold text-green-600">
                {trackingData.filter((o) => o.status === "Delivered").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chậm trễ</p>
              <p className="text-2xl font-bold text-red-600">
                {trackingData.filter((o) => o.status === "Delayed").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, mã tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Processing">Đang xử lý</option>
              <option value="In Transit">Đang vận chuyển</option>
              <option value="Delivered">Đã giao</option>
              <option value="Delayed">Chậm trễ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tracking Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Đơn hàng
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Khách hàng
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Vị trí hiện tại
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Tiến độ
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Dự kiến giao
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.product}</p>
                      <p className="text-xs text-blue-600">
                        {order.trackingCode}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xs">
                          {order.customerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-500">{order.route}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500 text-sm" />
                      <span className="text-sm text-gray-900">
                        {order.currentLocation}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${getProgressColor(
                            order.status
                          )} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">{getStatusBadge(order.status)}</td>

                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">
                      {order.estimatedDelivery}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Xem chi tiết"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <FaDownload className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <FaBox className="mx-auto text-gray-300 text-4xl mb-4" />
            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Chi tiết đơn hàng {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Khách hàng</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Sản phẩm</p>
                  <p className="font-medium">{selectedOrder.product}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Mã tracking</p>
                  <p className="font-medium text-blue-600">
                    {selectedOrder.trackingCode}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Tuyến đường</p>
                  <p className="font-medium">{selectedOrder.route}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Lịch trình vận chuyển
                </h4>
                <div className="space-y-4">
                  {selectedOrder.timeline.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`font-medium ${
                              step.completed ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.status}
                          </p>
                          <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                        {step.location && (
                          <p className="text-sm text-gray-600">
                            {step.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
