import React, { useState, useEffect, useCallback } from "react";
import orderService from "../../Services/LeadSale/orderService";
import routesService from "../../Services/StaffSale/routeService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { getAllProductTypes } from "../../Services/Manager/managerProductTypeService";
import toast from "react-hot-toast";
import AccountSearch from "./AccountSearch";
import ProductManager from "./ProducManager";

const CreateOrderForm = () => {
  // Consolidated states
  const [preliminary, setPreliminary] = useState({
    customerCode: "",
    routeId: "",
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [form, setForm] = useState({
    orderType: "MUA_HO",
    destinationId: "",
    exchangeRate: "",
    checkRequired: false,
  });

  const [products, setProducts] = useState([
    {
      productLink: "",
      quantity: 1,
      priceWeb: "",
      shipWeb: "",
      productName: "",
      purchaseFee: "",
      extraCharge: "",
      purchaseImage: "",
      website: "",
      productTypeId: "",
      groupTag: "",
      note: "",
    },
  ]);

  const [masterData, setMasterData] = useState({
    routes: [],
    destinations: [],
    productTypes: [],
  });

  const [ui, setUi] = useState({
    loading: false,
    error: null,
  });

  // Fetch data once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setUi((prev) => ({ ...prev, loading: true, error: null }));
        const token = localStorage.getItem("token");

        const [routesData, destinationsData, productTypesData] =
          await Promise.all([
            routesService.getRoutesByAccount(token),
            managerDestinationService.getDestinations(),
            getAllProductTypes(),
          ]);

        setMasterData({
          routes: routesData,
          destinations: destinationsData,
          productTypes: productTypesData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error.response?.status === 401
            ? "Token đã hết hạn. Vui lòng đăng nhập lại."
            : error.response?.status === 404
            ? "Không tìm thấy API. Kiểm tra cấu hình server."
            : "Lỗi khi tải dữ liệu.";
        setUi((prev) => ({ ...prev, error: errorMessage }));
      } finally {
        setUi((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  // Memoized handlers
  const handleSelectCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    setPreliminary((prev) => ({
      ...prev,
      customerCode: customer.customerCode,
    }));
    toast.success(
      `Đã chọn khách hàng: ${customer.name} (${customer.customerCode})`
    );
  }, []);

  const handleCustomerCodeChange = useCallback(
    (e) => {
      const value = e.target.value;
      setPreliminary((prev) => ({ ...prev, customerCode: value }));

      if (
        !value ||
        (selectedCustomer && value !== selectedCustomer.customerCode)
      ) {
        setSelectedCustomer(null);
      }
    },
    [selectedCustomer]
  );

  const handleClearCustomer = useCallback(() => {
    setPreliminary((prev) => ({ ...prev, customerCode: "" }));
    setSelectedCustomer(null);
    toast("Đã xóa thông tin khách hàng", { icon: "🗑️" });
  }, []);

  const handlePreliminaryChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "routeId") {
        const selectedRoute = masterData.routes.find(
          (route) => route.routeId === Number(value)
        );
        setPreliminary((prev) => ({ ...prev, [name]: value }));

        if (selectedRoute?.exchangeRate) {
          setForm((prev) => ({
            ...prev,
            exchangeRate: selectedRoute.exchangeRate,
          }));
          toast.success(
            `Tỷ giá hôm nay: ${selectedRoute.exchangeRate.toLocaleString()} VND`
          );
        }
      } else {
        setPreliminary((prev) => ({ ...prev, [name]: value }));
      }
    },
    [masterData.routes]
  );

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "destinationId"
          ? Number(value)
          : value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const orderData = {
        ...form,
        orderLinkRequests: products,
      };

      await orderService.createOrder(
        preliminary.customerCode,
        preliminary.routeId,
        orderData
      );
      toast.success("Tạo đơn hàng thành công!");

      // Reset form
      setPreliminary({ customerCode: "", routeId: "" });
      setSelectedCustomer(null);
      setForm({
        orderType: "MUA_HO",
        destinationId: "",
        exchangeRate: "",
        checkRequired: false,
      });
      setProducts([
        {
          productLink: "",
          quantity: 1,
          priceWeb: "",
          shipWeb: "",
          productName: "",
          purchaseFee: "",
          extraCharge: "",
          purchaseImage: "",
          website: "",
          productTypeId: "",
          groupTag: "",
          note: "",
        },
      ]);
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Tạo đơn hàng thất bại";
      toast.error(errorMessage);
    }
  }, [preliminary, form, products]);

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tạo đơn hàng mới
          </h1>

          {ui.error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {ui.error}
            </div>
          )}

          {ui.loading && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
              Đang tải dữ liệu...
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Customer Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thông tin khách hàng
              </h3>
              <AccountSearch
                onSelectAccount={handleSelectCustomer}
                value={preliminary.customerCode}
                onChange={handleCustomerCodeChange}
                onClear={handleClearCustomer}
              />

              {selectedCustomer && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm font-medium text-blue-900">
                    {selectedCustomer.name}
                  </p>
                  <p className="text-sm text-blue-600">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Route Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Tuyến đường
              </h3>
              <select
                name="routeId"
                value={preliminary.routeId}
                onChange={handlePreliminaryChange}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={ui.loading || ui.error}
              >
                <option value="">
                  {ui.loading
                    ? "Đang tải..."
                    : ui.error
                    ? "Không thể tải tuyến đường"
                    : "Chọn tuyến đường"}
                </option>
                {masterData.routes.map((route) => (
                  <option key={route.routeId} value={route.routeId}>
                    {route.name} ({route.shipTime} ngày,{" "}
                    {route.unitBuyingPrice.toLocaleString()} đ)
                  </option>
                ))}
              </select>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thông tin đơn hàng
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Loại đơn
                    </label>
                    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-md text-sm font-medium text-green-700">
                      Mua hộ
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Điểm đến
                    </label>
                    <select
                      name="destinationId"
                      value={form.destinationId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled || ui.loading}
                    >
                      <option value="">Chọn điểm đến</option>
                      {masterData.destinations.map((destination) => (
                        <option
                          key={destination.destinationId}
                          value={destination.destinationId}
                        >
                          {destination.destinationName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tỷ giá (VND)
                  </label>
                  <input
                    type="number"
                    name="exchangeRate"
                    value={form.exchangeRate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Viet Nam Dong (VND)"
                    disabled={!isFormEnabled}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="checkRequired"
                    checked={form.checkRequired}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={!isFormEnabled}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Kiểm hàng trước khi giao
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Products */}
          <div className="col-span-12 lg:col-span-8">
            <ProductManager
              products={products}
              setProducts={setProducts}
              productTypes={masterData.productTypes}
              isFormEnabled={isFormEnabled}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {!isFormEnabled && (
                <span className="text-amber-600 flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Vui lòng chọn khách hàng và tuyến đường để tiếp tục
                  </span>
                </span>
              )}
              {isFormEnabled && (
                <span className="text-green-600 flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sẵn sàng tạo đơn hàng</span>
                </span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center space-x-2"
              disabled={!isFormEnabled}
            >
              <span>Hoàn tất đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderForm;
// okk
