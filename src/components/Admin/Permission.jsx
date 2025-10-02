// src/components/Manager/Permission.jsx
import React, { useState, useEffect } from "react";
import userService from "../../Services/Manager/userService";
import managerRoutesService from "../../Services/Manager/managerRoutesService";
import createAccountRoutesService from "../../Services/Auth/createAccountRouteService";
import toast, { Toaster } from "react-hot-toast";

const Permission = () => {
  const [staffList, setStaffList] = useState([]);
  const [routesList, setRoutesList] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // Fetch staff list
  useEffect(() => {
    const fetchStaffList = async () => {
      setLoadingStaff(true);
      try {
        const response = await userService.getSaleLeadStaff(0, 100);
        setStaffList(response.content);
      } catch (error) {
        toast.error("Không thể tải danh sách nhân viên!");
        console.error("Error fetching staff:", error);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaffList();
  }, []);

  // Fetch routes list
  useEffect(() => {
    const fetchRoutesList = async () => {
      setLoadingRoutes(true);
      try {
        const data = await managerRoutesService.getRoutes();
        setRoutesList(data);
      } catch (error) {
        toast.error("Không thể tải danh sách tuyến!");
        console.error("Error fetching routes:", error);
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchRoutesList();
  }, []);

  // Handle account selection
  const handleAccountChange = (accountId) => {
    setSelectedAccountId(accountId);
    const account = staffList.find((s) => s.accountId === parseInt(accountId));
    setSelectedAccount(account);
  };

  // Handle route selection
  const handleRouteChange = (routeId) => {
    setSelectedRouteId(routeId);
    const route = routesList.find((r) => r.routeId === parseInt(routeId));
    setSelectedRoute(route);
  };

  // Handle assign route
  const handleAssignRoute = async () => {
    if (!selectedAccount) {
      toast.error("Vui lòng chọn tài khoản!");
      return;
    }

    if (!selectedRouteId || selectedRouteId <= 0) {
      toast.error("Vui lòng chọn Route!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Đang gán route...");

    try {
      await createAccountRoutesService.assignRouteToAccount(
        selectedAccount.accountId,
        parseInt(selectedRouteId)
      );

      toast.success(
        `Đã gán Route "${selectedRoute?.name}" cho ${selectedAccount.name} thành công!`,
        { id: loadingToast }
      );

      // Reset form
      handleClearSelection();
    } catch (error) {
      console.error("Error assigning route:", error);

      let errorMessage = error.message || "Có lỗi xảy ra khi gán route!";

      if (error.response?.data) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          error.response.data.detail ||
          errorMessage;
      }

      toast.error(errorMessage, { id: loadingToast, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedAccount(null);
    setSelectedAccountId("");
    setSelectedRouteId("");
    setSelectedRoute(null);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Gán quyền Route cho tài khoản
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Chọn tài khoản và tuyến vận chuyển để gán quyền
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn tài khoản <span className="text-red-500">*</span>
            </label>
            {loadingStaff ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                <span>Đang tải danh sách nhân viên...</span>
              </div>
            ) : (
              <select
                value={selectedAccountId}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loadingStaff}
              >
                <option value="">-- Chọn nhân viên --</option>
                {staffList.map((staff) => (
                  <option key={staff.accountId} value={staff.accountId}>
                    {staff.staffCode} - {staff.name} ({staff.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Route Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn tuyến vận chuyển <span className="text-red-500">*</span>
            </label>
            {loadingRoutes ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                <span>Đang tải danh sách tuyến...</span>
              </div>
            ) : (
              <select
                value={selectedRouteId}
                onChange={(e) => handleRouteChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loadingRoutes}
              >
                <option value="">-- Chọn tuyến vận chuyển --</option>
                {routesList.map((route) => (
                  <option key={route.routeId} value={route.routeId}>
                    #{route.routeId} - {route.name} ({route.shipTime}) - Tỷ giá:{" "}
                    {route.exchangeRate
                      ? formatCurrency(route.exchangeRate)
                      : "N/A"}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Info */}
          {(selectedAccount || selectedRoute) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">
                  Thông tin đã chọn:
                </h3>
                <button
                  onClick={handleClearSelection}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  ✕ Xóa
                </button>
              </div>

              {selectedAccount && (
                <div className="bg-white p-3 rounded border border-blue-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Tài khoản
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Mã NV:</span>{" "}
                      <span className="text-gray-700">
                        {selectedAccount.staffCode}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tên:</span>{" "}
                      <span className="text-gray-700">
                        {selectedAccount.name}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Email:</span>{" "}
                      <span className="text-gray-700">
                        {selectedAccount.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedRoute && (
                <div className="bg-white p-3 rounded border border-blue-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Tuyến vận chuyển
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Mã tuyến:</span>{" "}
                      <span className="text-gray-700">
                        #{selectedRoute.routeId}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tên:</span>{" "}
                      <span className="text-gray-700">
                        {selectedRoute.name}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Thời gian:</span>{" "}
                      <span className="text-gray-700">
                        {selectedRoute.shipTime}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tỷ giá:</span>{" "}
                      <span className="text-gray-700 font-mono">
                        {selectedRoute.exchangeRate
                          ? formatCurrency(selectedRoute.exchangeRate)
                          : "N/A"}
                      </span>
                    </div>
                    {selectedRoute.note && (
                      <div className="col-span-2">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        <span className="text-gray-700">
                          {selectedRoute.note}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleAssignRoute}
              disabled={loading || !selectedAccount || !selectedRouteId}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>📌</span>
                  <span>Gán Route</span>
                </>
              )}
            </button>

            <button
              onClick={handleClearSelection}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permission;
