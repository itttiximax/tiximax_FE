import React, { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import destinationService from "../../Services/LeadSale/destinationService";

const ManagerDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDestinations = async () => {
    if (!token) {
      setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await destinationService.getDestinations(token);
      setDestinations(data);
      toast.success("Đã tải danh sách điểm đến");
    } catch (error) {
      console.error("Error fetching destinations:", error);

      if (error.response?.status === 401) {
        setError("Token đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 404) {
        setError("Không tìm thấy API destinations. Kiểm tra cấu hình server.");
      } else {
        setError("Lỗi khi tải dữ liệu điểm đến");
      }

      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Header */}
      <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <MapPin size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Quản lý Điểm Đến
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các điểm đến trong hệ thống
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {destinations.length}
              </p>
              <p className="text-sm text-gray-600">Tổng điểm đến</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "..." : "Hoạt động"}
              </p>
              <p className="text-sm text-gray-600">Trạng thái hệ thống</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-800">Có lỗi xảy ra</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchDestinations}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg">
            <div className="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">
              Đang tải dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && destinations.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có điểm đến nào
            </h3>
            <p className="text-gray-600 mb-4">
              Hệ thống chưa có điểm đến nào được cấu hình
            </p>
          </div>
        </div>
      )}

      {/* Destinations Table */}
      {!loading && !error && destinations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách Điểm Đến ({destinations.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                    Tên Điểm Đến
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {destinations.map((destination, index) => (
                  <tr
                    key={destination.destinationId}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 text-xs font-bold">
                            {destination.destinationId}
                          </span>
                        </div>
                        #{destination.destinationId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-emerald-500" />
                        <span className="font-medium">
                          {destination.destinationName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                        Hoạt động
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      {!loading && (
        <div className="mt-6 text-center">
          <button
            onClick={fetchDestinations}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Làm mới dữ liệu
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerDestination;
