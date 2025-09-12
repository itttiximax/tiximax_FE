import React, { useState, useEffect, useCallback } from "react";
import orderService from "../../Services/LeadSale/orderService";
import routesService from "../../Services/StaffSale/routeService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { getAllProductTypes } from "../../Services/Manager/managerProductTypeService";
import uploadImageService from "../../Services/uploadImageService";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import AccountSearch from "../LeadSale/AccountSearch";

const CreateOrder = () => {
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
    orderLinkRequests: [
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
    ],
  });

  const [masterData, setMasterData] = useState({
    routes: [],
    destinations: [],
    productTypes: [],
  });

  const [ui, setUi] = useState({
    loading: false,
    error: null,
    uploadingImages: {},
    deletingImages: {}, // Track image deletion state
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

  const handleProductChange = useCallback(
    (index, e) => {
      const { name, value } = e.target;
      setForm((prev) => {
        const updatedProducts = [...prev.orderLinkRequests];

        if (name === "productTypeId") {
          const productTypeId = Number(value);
          const productType = masterData.productTypes.find(
            (p) => p.productTypeId === productTypeId
          );
          updatedProducts[index] = {
            ...updatedProducts[index],
            [name]: productTypeId,
            extraCharge: productType?.fee
              ? updatedProducts[index].extraCharge
              : 0,
          };
        } else {
          updatedProducts[index][name] = [
            "quantity",
            "priceWeb",
            "shipWeb",
            "purchaseFee",
            "extraCharge",
          ].includes(name)
            ? Number(value)
            : value;
        }

        return { ...prev, orderLinkRequests: updatedProducts };
      });
    },
    [masterData.productTypes]
  );

  const handleImageUpload = useCallback(async (index, file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("File quá lớn. Vui lòng chọn ảnh dưới 1MB");
      return;
    }

    const uploadKey = `product_${index}`;

    try {
      setUi((prev) => ({
        ...prev,
        uploadingImages: { ...prev.uploadingImages, [uploadKey]: true },
      }));

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const response = await uploadImageService.upload(compressedFile);

      let imageUrl =
        typeof response === "string" && response.startsWith("http")
          ? response
          : response?.url || response?.imageUrl || response?.data?.url;

      if (!imageUrl) {
        toast.error("Upload thành công nhưng không lấy được URL ảnh");
        return;
      }

      setForm((prev) => {
        const updatedProducts = [...prev.orderLinkRequests];
        updatedProducts[index].purchaseImage = imageUrl;
        return { ...prev, orderLinkRequests: updatedProducts };
      });

      toast.success(`Upload ảnh sản phẩm ${index + 1} thành công!`);
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error(
        "Upload thất bại: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setUi((prev) => ({
        ...prev,
        uploadingImages: { ...prev.uploadingImages, [uploadKey]: false },
      }));
    }
  }, []);

  const handleRemoveImage = useCallback(
    async (index) => {
      const currentImage = form.orderLinkRequests[index].purchaseImage;

      if (!currentImage) {
        toast.error("Không có ảnh để xóa");
        return;
      }

      const deleteKey = `product_${index}`;

      try {
        // Set deleting state
        setUi((prev) => ({
          ...prev,
          deletingImages: { ...prev.deletingImages, [deleteKey]: true },
        }));

        // Try to delete from server first
        try {
          await uploadImageService.deleteByUrl(currentImage);
          console.log("Đã xóa ảnh từ server thành công");
        } catch (deleteError) {
          console.warn("Không thể xóa ảnh từ server:", deleteError);
          // Continue anyway - remove from form even if server deletion fails
        }

        // Remove from form state
        setForm((prev) => {
          const updatedProducts = [...prev.orderLinkRequests];
          updatedProducts[index].purchaseImage = "";
          return { ...prev, orderLinkRequests: updatedProducts };
        });

        toast.success("Đã xóa ảnh sản phẩm thành công");
      } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        toast.error("Có lỗi khi xóa ảnh");
      } finally {
        setUi((prev) => ({
          ...prev,
          deletingImages: { ...prev.deletingImages, [deleteKey]: false },
        }));
      }
    },
    [form.orderLinkRequests]
  );

  const addProduct = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      orderLinkRequests: [
        ...prev.orderLinkRequests,
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
      ],
    }));
  }, []);

  const removeProduct = useCallback(
    async (index) => {
      const productToRemove = form.orderLinkRequests[index];

      // If product has an image, try to delete it first
      if (productToRemove.purchaseImage) {
        try {
          await uploadImageService.deleteByUrl(productToRemove.purchaseImage);
          console.log("Đã xóa ảnh sản phẩm khỏi server");
        } catch (error) {
          console.warn("Không thể xóa ảnh sản phẩm:", error);
        }
      }

      setForm((prev) => ({
        ...prev,
        orderLinkRequests: prev.orderLinkRequests.filter((_, i) => i !== index),
      }));

      toast.success("Đã xóa sản phẩm");
    },
    [form.orderLinkRequests]
  );

  const handleSubmit = useCallback(async () => {
    try {
      await orderService.createOrder(
        preliminary.customerCode,
        preliminary.routeId,
        form
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
        orderLinkRequests: [
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
        ],
      });
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Tạo đơn hàng thất bại";
      toast.error(errorMessage);
    }
  }, [preliminary, form]);

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  Danh sách sản phẩm ({form.orderLinkRequests.length})
                </h3>
                <button
                  onClick={addProduct}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
                  disabled={!isFormEnabled}
                >
                  <span>+</span>
                  <span>Thêm sản phẩm</span>
                </button>
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {form.orderLinkRequests.map((product, index) => {
                  const uploadKey = `product_${index}`;
                  const deleteKey = `product_${index}`;
                  const isUploading = ui.uploadingImages[uploadKey];
                  const isDeleting = ui.deletingImages[deleteKey];

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium text-gray-700">
                          Sản phẩm {index + 1}
                        </span>
                        {index > 0 && (
                          <button
                            onClick={() => removeProduct(index)}
                            className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-300 rounded-md hover:bg-red-50"
                            disabled={!isFormEnabled}
                          >
                            Xóa
                          </button>
                        )}
                      </div>

                      {/* Product Basic Info */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Tên sản phẩm
                          </label>
                          <input
                            type="text"
                            name="productName"
                            value={product.productName}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Nhập tên sản phẩm..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Website
                          </label>
                          <input
                            type="text"
                            name="website"
                            value={product.website}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="AMAZON, SHOPEE..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Số lượng
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Product Link */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Link sản phẩm
                        </label>
                        <input
                          type="text"
                          name="productLink"
                          value={product.productLink}
                          onChange={(e) => handleProductChange(index, e)}
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={!isFormEnabled}
                          placeholder="https://..."
                        />
                      </div>

                      {/* Price Info */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Giá sản phẩm
                          </label>
                          <input
                            type="number"
                            name="priceWeb"
                            value={product.priceWeb}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Giá ngoại tệ"
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Phí ship
                          </label>
                          <input
                            type="number"
                            name="shipWeb"
                            value={product.shipWeb}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Giá ngoại tệ"
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Phí mua hộ
                          </label>
                          <input
                            type="number"
                            name="purchaseFee"
                            value={product.purchaseFee}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Giá ngoại tệ"
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Group Tag
                          </label>
                          <input
                            type="text"
                            name="groupTag"
                            value={product.groupTag}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="A, B, C..."
                          />
                        </div>
                      </div>

                      {/* Product Type and Extra Charge */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Loại sản phẩm
                          </label>
                          <select
                            name="productTypeId"
                            value={product.productTypeId}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={!isFormEnabled || ui.loading}
                          >
                            <option value="">Chọn loại sản phẩm</option>
                            {masterData.productTypes.map((type) => (
                              <option
                                key={type.productTypeId}
                                value={type.productTypeId}
                              >
                                {type.productTypeName}{" "}
                                {type.fee ? "(Có phí)" : "(Miễn phí)"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Phụ phí
                          </label>
                          {masterData.productTypes.find(
                            (p) => p.productTypeId === product.productTypeId
                          )?.fee ? (
                            <input
                              type="number"
                              name="extraCharge"
                              value={product.extraCharge}
                              onChange={(e) => handleProductChange(index, e)}
                              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={!isFormEnabled}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          ) : (
                            <div className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-500 flex items-center">
                              Miễn phí (0 VND)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-gray-600">
                            Ảnh sản phẩm
                          </label>
                          <div className="flex space-x-3">
                            <label className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 disabled:opacity-50 text-sm">
                              {isUploading ? "Đang upload..." : "Chọn ảnh"}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageUpload(index, e.target.files[0])
                                }
                                className="hidden"
                                disabled={!isFormEnabled || isUploading}
                              />
                            </label>
                            {product.purchaseImage && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm disabled:opacity-50"
                                disabled={!isFormEnabled || isDeleting}
                              >
                                {isDeleting ? "Đang xóa..." : "Xóa ảnh"}
                              </button>
                            )}
                          </div>
                        </div>

                        {product.purchaseImage ? (
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                src={product.purchaseImage}
                                alt={`Product ${index + 1}`}
                                className="w-24 h-24 object-cover border border-gray-200 rounded-md shadow-sm"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-sm font-medium text-green-800">
                                    Ảnh sản phẩm đã được tải lên thành công
                                  </span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">
                                  Ảnh sẽ được hiển thị trong đơn hàng
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic bg-gray-100 p-4 rounded-md text-center border-2 border-dashed border-gray-300">
                            <div className="flex flex-col items-center space-y-2">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>Chưa có ảnh sản phẩm</span>
                              <span className="text-xs">
                                Click "Chọn ảnh" để upload ảnh sản phẩm
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Note */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Ghi chú
                        </label>
                        <textarea
                          name="note"
                          value={product.note}
                          onChange={(e) => handleProductChange(index, e)}
                          rows="3"
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={!isFormEnabled}
                          placeholder="Ghi chú cho sản phẩm này..."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Hoàn tất đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
