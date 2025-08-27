import React, { useState, useEffect } from "react";
import { getAllProductTypes } from "../../Services/LeadSale/productTypeService";
import {
  Package,
  DollarSign,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const ManagerProductType = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data khi component mount
  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProductTypes();
      setProductTypes(data);
    } catch (err) {
      setError("Không thể tải danh sách loại sản phẩm. Vui lòng thử lại!");
      console.error("Error fetching product types:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProductTypes();
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mr-3" />
            <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý loại sản phẩm
            </h1>
            <p className="text-gray-600">
              Danh sách các loại sản phẩm trong hệ thống
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Tổng loại sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {productTypes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Có phí</p>
              <p className="text-2xl font-bold text-gray-900">
                {productTypes.filter((type) => type.fee).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Miễn phí</p>
              <p className="text-2xl font-bold text-gray-900">
                {productTypes.filter((type) => !type.fee).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Types Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách loại sản phẩm
          </h2>
        </div>

        {productTypes.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Không có loại sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên loại sản phẩm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái phí
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productTypes.map((productType) => (
                  <tr
                    key={productType.productTypeId}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{productType.productTypeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {productType.productTypeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {productType.fee ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Có phí
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Miễn phí
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerProductType;
