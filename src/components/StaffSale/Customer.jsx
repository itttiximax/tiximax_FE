import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fake customer data
  const customers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      phone: "0901234567",
      orders: 12,
      status: "Active",
      joinDate: "2024-01-15",
      totalSpent: "15,500,000",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@example.com",
      phone: "0912345678",
      orders: 8,
      status: "Inactive",
      joinDate: "2024-02-20",
      totalSpent: "8,200,000",
    },
    {
      id: 3,
      name: "Lê Minh Châu",
      email: "chau.le@example.com",
      phone: "0923456789",
      orders: 15,
      status: "Active",
      joinDate: "2023-12-10",
      totalSpent: "22,800,000",
    },
    {
      id: 4,
      name: "Phạm Quốc Đạt",
      email: "dat.pham@example.com",
      phone: "0934567890",
      orders: 5,
      status: "Pending",
      joinDate: "2024-03-05",
      totalSpent: "5,100,000",
    },
    {
      id: 5,
      name: "Hoàng Thị E",
      email: "e.hoang@example.com",
      phone: "0945678901",
      orders: 20,
      status: "Active",
      joinDate: "2023-11-18",
      totalSpent: "32,400,000",
    },
  ];

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-700 border-green-200",
      Inactive: "bg-red-100 text-red-700 border-red-200",
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-200"
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full mr-2 ${
            status === "Active"
              ? "bg-green-500"
              : status === "Inactive"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        ></div>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6 ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Danh Sách Khách Hàng
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý thông tin khách hàng và đơn hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <FaPlus className="text-sm" />
            <span className="text-sm font-medium">Thêm khách hàng</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaEye className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter((c) => c.status === "Active").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {customers.filter((c) => c.status === "Pending").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.orders, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaPlus className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Active">Đang hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
              <option value="Pending">Chờ xử lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Khách hàng
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Liên hệ
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Đơn hàng
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Tổng chi tiêu
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Trạng thái
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: #{customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-xs" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-xs" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">
                        {customer.orders}
                      </p>
                      <p className="text-xs text-gray-500">đơn hàng</p>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">
                      {customer.totalSpent}₫
                    </p>
                    <p className="text-xs text-gray-500">
                      Từ {customer.joinDate}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    {getStatusBadge(customer.status)}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <FaEye className="text-sm" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <FaEdit className="text-sm" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị{" "}
            <span className="font-medium">1-{filteredCustomers.length}</span>{" "}
            trong tổng số{" "}
            <span className="font-medium">{customers.length}</span> khách hàng
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200">
              Trước
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
