// src/components/Manager/StaffListPermission.jsx
import React, { useState, useEffect } from "react";
import userService from "../../Services/Manager/userService";

const StaffListPermission = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // Fetch staff data
  const fetchStaffData = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await userService.getSaleLeadStaff(page, size);
      setStaffData(response.content);
      setCurrentPage(response.number);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      alert("Không thể tải danh sách nhân viên: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData(0, 10);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchStaffData(newPage, pageSize);
    }
  };

  // Get role color classes
  const getRoleColorClass = (role) => {
    const colorMap = {
      red: "bg-red-50 text-red-700 border-red-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
      green: "bg-green-50 text-green-700 border-green-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    const roleConfig = userService
      .getAvailableRoles()
      .find((r) => r.key === role);
    return colorMap[roleConfig?.color] || colorMap.gray;
  };

  // Get role label
  const getRoleLabel = (role) => {
    const roleConfig = userService
      .getAvailableRoles()
      .find((r) => r.key === role);
    return roleConfig?.label || role;
  };

  // Get status color classes
  const getStatusColorClass = (status) => {
    const colorMap = {
      green: "bg-green-50 text-green-700 border-green-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    const statusConfig = userService
      .getAvailableStatuses()
      .find((s) => s.key === status);
    return colorMap[statusConfig?.color] || colorMap.gray;
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusConfig = userService
      .getAvailableStatuses()
      .find((s) => s.key === status);
    return statusConfig?.label || status;
  };

  // Filter data
  const getFilteredData = () => {
    let filtered = [...staffData];

    if (searchText) {
      filtered = filtered.filter(
        (staff) =>
          staff.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          staff.username?.toLowerCase().includes(searchText.toLowerCase()) ||
          staff.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          staff.staffCode?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterRole) {
      filtered = filtered.filter((staff) => staff.role === filterRole);
    }

    return filtered;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách nhân viên Sale Lead
          </h2>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, mã NV..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="min-w-[180px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Tất cả vai trò</option>
              {userService.getAvailableRoles().map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchStaffData(currentPage, pageSize)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 font-medium"
            >
              <span>🔄</span>
              <span>Làm mới</span>
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Mã NV
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tên nhân viên
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tên đăng nhập
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phòng ban
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Địa điểm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((staff) => (
                      <tr
                        key={staff.accountId}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {staff.staffCode}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staff.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {staff.username}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {staff.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {staff.phone}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleColorClass(
                              staff.role
                            )}`}
                          >
                            {getRoleLabel(staff.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {staff.department}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {staff.location}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColorClass(
                              staff.status
                            )}`}
                          >
                            {getStatusLabel(staff.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(staff.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-600">
              Hiển thị {filteredData.length} / {totalElements} nhân viên
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium text-gray-700"
              >
                ← Trước
              </button>

              <span className="text-sm text-gray-600 min-w-[100px] text-center">
                Trang {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium text-gray-700"
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffListPermission;
