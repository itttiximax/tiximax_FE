import React, { useState, useEffect } from "react";
import orderService from "../../Services/LeadSale/orderService";
import routesService from "../../Services/StaffSale/routeService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { getAllProductTypes } from "../../Services/Manager/managerProductTypeService";
import uploadImageService from "../../Services/uploadImageService";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import AccountSearch from "../LeadSale/AccountSearch";

const CreateOrder = () => {
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
    note: "",
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
      },
    ],
  });
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States cho upload ảnh
  const [uploadingImages, setUploadingImages] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        const [routesData, destinationsData, productTypesData] =
          await Promise.all([
            routesService.getRoutesByAccount(token),
            managerDestinationService.getDestinations(),
            getAllProductTypes(),
          ]);

        setRoutes(routesData);
        setDestinations(destinationsData);
        setProductTypes(productTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          setError("Token đã hết hạn. Vui lòng đăng nhập lại.");
        } else if (error.response?.status === 404) {
          setError("Không tìm thấy API. Kiểm tra cấu hình server.");
        } else {
          setError("Lỗi khi tải dữ liệu.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cleanup image previews
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  // Handle customer selection từ AccountSearch
  const handleSelectCustomer = (customer) => {
    console.log("Selected customer:", customer);
    setSelectedCustomer(customer);
    setPreliminary({
      ...preliminary,
      customerCode: customer.customerCode,
    });
    toast.success(
      `Đã chọn khách hàng: ${customer.name} (${customer.customerCode})`
    );
  };

  // Handle manual customer code input
  const handleCustomerCodeChange = (e) => {
    const value = e.target.value;
    setPreliminary({ ...preliminary, customerCode: value });

    // Clear selected customer nếu value rỗng hoặc khác với selected customer
    if (
      !value ||
      (selectedCustomer && value !== selectedCustomer.customerCode)
    ) {
      setSelectedCustomer(null);
    }
  };

  // Thêm function để clear customer - được gọi khi bấm X
  const handleClearCustomer = () => {
    setPreliminary({ ...preliminary, customerCode: "" });
    setSelectedCustomer(null);
    toast("Đã xóa thông tin khách hàng", { icon: "🗑️" });
  };

  const getProductTypeFee = (productTypeId) => {
    const productType = productTypes.find(
      (p) => p.productTypeId === productTypeId
    );
    return productType?.fee || false;
  };

  // Updated handlePreliminaryChange function with auto-fill exchangeRate
  const handlePreliminaryChange = (e) => {
    const { name, value } = e.target;

    if (name === "routeId") {
      // Tìm route được chọn
      const selectedRoute = routes.find(
        (route) => route.routeId === Number(value)
      );

      // Update preliminary state
      setPreliminary({ ...preliminary, [name]: value });

      // Auto-fill exchangeRate nếu route có exchangeRate
      if (selectedRoute && selectedRoute.exchangeRate) {
        setForm({
          ...form,
          exchangeRate: selectedRoute.exchangeRate,
        });

        // Thêm toast notification
        toast.success(
          `Tỷ giá hôm nay: ${selectedRoute.exchangeRate.toLocaleString()} VND`
        );
      }
    } else {
      setPreliminary({ ...preliminary, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : name === "destinationId"
          ? Number(value)
          : value,
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...form.orderLinkRequests];

    if (name === "productTypeId") {
      const productTypeId = Number(value);
      const hasFee = getProductTypeFee(productTypeId);
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: productTypeId,
        extraCharge: hasFee ? updatedProducts[index].extraCharge : 0,
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

    setForm({ ...form, orderLinkRequests: updatedProducts });
  };

  // Handle image upload cho từng product
  const handleImageUpload = async (index, file) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size / 1024 / 1024 > 1) {
      toast.error("File quá lớn. Vui lòng chọn ảnh dưới 1MB");
      return;
    }

    const uploadKey = `product_${index}`;

    try {
      // Set uploading state
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));
      setUploadProgress((prev) => ({ ...prev, [uploadKey]: 0 }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({ ...prev, [uploadKey]: previewUrl }));

      // Compress image
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Upload image
      const response = await uploadImageService.upload(compressedFile, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress((prev) => ({ ...prev, [uploadKey]: percent }));
        },
      });

      // Debug: Log toàn bộ response để xem cấu trúc
      console.log("=== UPLOAD DEBUG ===");
      console.log("Full response từ upload:", response);
      console.log("Response type:", typeof response);

      // Backend trả về string URL trực tiếp
      let imageUrl = null;

      if (typeof response === "string" && response.startsWith("http")) {
        // Response là URL string trực tiếp
        imageUrl = response;
      } else if (response && typeof response === "object") {
        // Thử các field thường gặp cho object response
        imageUrl =
          response.url ||
          response.imageUrl ||
          response.publicUrl ||
          response.data?.url ||
          response.data?.publicUrl ||
          response.data?.imageUrl ||
          response.path ||
          response.data?.path;

        // Nếu có baseURL, combine với path
        if (!imageUrl && response.path && response.baseUrl) {
          imageUrl = response.baseUrl + response.path;
        }
      }

      console.log("Image URL extracted:", imageUrl);
      console.log("==================");

      if (!imageUrl) {
        console.error("Không tìm thấy URL trong response:", response);
        toast.error("Upload thành công nhưng không lấy được URL ảnh");
        return;
      }

      // Update purchaseImage URL in form
      const updatedProducts = [...form.orderLinkRequests];
      updatedProducts[index].purchaseImage = imageUrl;
      setForm({ ...form, orderLinkRequests: updatedProducts });

      toast.success(`Upload ảnh sản phẩm ${index + 1} thành công!`);
      console.log("Upload thành công, URL đã được set:", imageUrl);
      console.log(
        "Form updated, purchaseImage:",
        updatedProducts[index].purchaseImage
      );
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error(
        "Upload thất bại: " + (error.response?.data?.error || error.message)
      );

      // Clean up preview on error
      if (imagePreviews[uploadKey]) {
        URL.revokeObjectURL(imagePreviews[uploadKey]);
      }
      setImagePreviews((prev) => ({ ...prev, [uploadKey]: null }));
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
      setUploadProgress((prev) => ({ ...prev, [uploadKey]: 0 }));
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const uploadKey = `product_${index}`;

    // Clean up preview
    if (imagePreviews[uploadKey]) {
      URL.revokeObjectURL(imagePreviews[uploadKey]);
    }

    // Clear states
    setImagePreviews((prev) => ({ ...prev, [uploadKey]: null }));

    // Clear purchaseImage URL
    const updatedProducts = [...form.orderLinkRequests];
    updatedProducts[index].purchaseImage = "";
    setForm({ ...form, orderLinkRequests: updatedProducts });

    toast("Đã xóa ảnh sản phẩm", { icon: "🗑️" });
  };

  const addProduct = () => {
    setForm({
      ...form,
      orderLinkRequests: [
        ...form.orderLinkRequests,
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
        },
      ],
    });
  };

  const removeProduct = (index) => {
    const updatedProducts = form.orderLinkRequests.filter(
      (_, i) => i !== index
    );
    setForm({ ...form, orderLinkRequests: updatedProducts });
  };

  const handleSubmit = async () => {
    try {
      const result = await orderService.createOrder(
        preliminary.customerCode,
        preliminary.routeId,
        form
      );
      console.log("Order created:", result);
      toast.success("Tạo đơn hàng thành công!");

      // Reset form after successful creation
      setPreliminary({ customerCode: "", routeId: "" });
      setSelectedCustomer(null);
      setForm({
        orderType: "MUA_HO",
        destinationId: "",
        exchangeRate: "",
        checkRequired: false,
        note: "",
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
          },
        ],
      });
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Tạo đơn hàng thất bại";
      toast.error(`${errorMessage}`);
    }
  };

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  return (
    <div className="min-h-screen bg-gray-10 p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-xl font-bold text-gray-800">Tạo đơn hàng mới</h1>

          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-3 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-md text-sm">
              Đang tải dữ liệu tuyến đường và điểm đến...
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Panel - Customer & Order Info */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Customer Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Tìm kiếm khách hàng
              </h3>

              <div className="space-y-3">
                <div className="relative">
                  <AccountSearch
                    onSelectAccount={handleSelectCustomer}
                    value={preliminary.customerCode}
                    onChange={handleCustomerCodeChange}
                    onClear={handleClearCustomer}
                  />
                  {preliminary.customerCode && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-blue-900">
                          {selectedCustomer.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          {selectedCustomer.email} • {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Route Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Tuyến đường
              </h3>

              <select
                name="routeId"
                value={preliminary.routeId}
                onChange={handlePreliminaryChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading || error}
              >
                <option value="">
                  {loading
                    ? "Đang tải..."
                    : error
                    ? "Không thể tải tuyến đường"
                    : "Chọn tuyến đường"}
                </option>
                {routes.map((route) => (
                  <option key={route.routeId} value={route.routeId}>
                    {route.name} ({route.shipTime} ngày,{" "}
                    {route.unitBuyingPrice.toLocaleString()} đ)
                  </option>
                ))}
              </select>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Thông tin đơn hàng
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Loại đơn
                    </label>
                    <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-xs font-medium text-green-700">
                      Mua hộ
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Điểm đến
                    </label>
                    <select
                      name="destinationId"
                      value={form.destinationId}
                      onChange={handleChange}
                      className="w-full px-2 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={!isFormEnabled || loading}
                    >
                      <option value="">
                        {loading
                          ? "Đang tải..."
                          : error
                          ? "Không thể tải điểm đến"
                          : "Chọn điểm đến"}
                      </option>
                      {destinations.map((destination) => (
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tỷ giá (VND)
                  </label>
                  <input
                    type="number"
                    name="exchangeRate"
                    value={form.exchangeRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <span className="ml-2 text-xs text-gray-700">
                    Kiểm hàng trước khi giao
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={!isFormEnabled}
                    placeholder="Ghi chú đơn hàng..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Products */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Danh sách sản phẩm ({form.orderLinkRequests.length})
                </h3>

                <button
                  onClick={addProduct}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 disabled:opacity-50 flex items-center transition-colors"
                  disabled={!isFormEnabled}
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Thêm
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {form.orderLinkRequests.map((product, index) => {
                  const uploadKey = `product_${index}`;
                  const isUploading = uploadingImages[uploadKey];
                  const progress = uploadProgress[uploadKey] || 0;
                  const preview = imagePreviews[uploadKey];

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-600">
                          Sản phẩm {index + 1}
                        </span>
                        {index > 0 && (
                          <button
                            onClick={() => removeProduct(index)}
                            className="text-red-500 hover:text-red-700 text-xs transition-colors"
                            disabled={!isFormEnabled}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {/* Row 1 */}
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Tên sản phẩm
                          </label>
                          <input
                            type="text"
                            name="productName"
                            value={product.productName}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Tên sản phẩm..."
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Website
                          </label>
                          <input
                            type="text"
                            name="website"
                            value={product.website}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="AMAZON, SHOPEE..."
                          />
                        </div>

                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            SL
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            min="1"
                          />
                        </div>

                        {/* Row 2 */}
                        <div className="col-span-6">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Link sản phẩm
                          </label>
                          <input
                            type="text"
                            name="productLink"
                            value={product.productLink}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="https://..."
                          />
                        </div>

                        {/* Row 3 */}
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Giá SP
                          </label>
                          <input
                            type="number"
                            name="priceWeb"
                            value={product.priceWeb}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Giá ngoại tệ"
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Phí ship
                          </label>
                          <input
                            type="number"
                            name="shipWeb"
                            value={product.shipWeb}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Giá ngoại tệ"
                            step="0.01"
                            min="0"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Phí mua hộ
                          </label>
                          <input
                            type="number"
                            name="purchaseFee"
                            value={product.purchaseFee}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="Giá ngoại tệ"
                            step="0.01"
                            min="0"
                          />
                        </div>

                        {/* Row 4 */}
                        <div className="col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Loại sản phẩm
                          </label>
                          <select
                            name="productTypeId"
                            value={product.productTypeId}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled || loading}
                          >
                            <option value="">
                              {loading ? "Đang tải..." : "Chọn loại sản phẩm"}
                            </option>
                            {productTypes.map((type) => (
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

                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Phụ phí
                          </label>
                          {getProductTypeFee(product.productTypeId) ? (
                            <input
                              type="number"
                              name="extraCharge"
                              value={product.extraCharge}
                              onChange={(e) => handleProductChange(index, e)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              disabled={!isFormEnabled}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          ) : (
                            <div className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-100 text-gray-500">
                              Miễn phí (0 VND)
                            </div>
                          )}
                        </div>

                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Group
                          </label>
                          <input
                            type="text"
                            name="groupTag"
                            value={product.groupTag}
                            onChange={(e) => handleProductChange(index, e)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!isFormEnabled}
                            placeholder="A, B, C..."
                          />
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-gray-600">
                            Ảnh sản phẩm
                          </label>
                          <div className="flex space-x-2">
                            <label className="bg-blue-500 text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-blue-600 disabled:opacity-50 transition-colors">
                              {isUploading ? "Uploading..." : "Chọn ảnh"}
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
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50 transition-colors"
                                disabled={!isFormEnabled || isUploading}
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress */}
                        {isUploading && (
                          <div className="mb-2">
                            <div className="text-xs text-gray-600 mb-1">
                              Đang upload... {progress}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Image Preview/Display */}
                        {(preview || product.purchaseImage) && (
                          <div className="flex items-start space-x-2">
                            <img
                              src={preview || product.purchaseImage}
                              alt={`Product ${index + 1}`}
                              className="w-16 h-16 object-cover border border-gray-200 rounded"
                            />
                            {product.purchaseImage && (
                              <div className="flex-1 text-xs text-gray-500 break-all bg-gray-100 p-2 rounded">
                                <strong>URL:</strong> {product.purchaseImage}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status message when no image */}
                        {!product.purchaseImage && !preview && !isUploading && (
                          <div className="text-xs text-gray-500 italic">
                            Chưa có ảnh sản phẩm. Click "Chọn ảnh" để upload.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {!isFormEnabled && (
                  <span className="text-amber-600 flex items-center text-xs">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Vui lòng chọn Mã khách hàng và Tuyến để tiếp tục
                  </span>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm transition-colors"
                disabled={!isFormEnabled}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Hoàn tất đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
