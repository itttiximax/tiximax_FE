import React, { useState, useEffect } from "react";
import orderService from "../../Services/LeadSale/orderService";
import routesService from "../../Services/StaffSale/routeService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { getAllProductTypes } from "../../Services/Manager/managerProductTypeService";
import uploadImageService from "../../Services/uploadImageService";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import AccountSearch from "../LeadSale/AccountSearch"; // Import AccountSearch component

const CreateOrder = () => {
  const [preliminary, setPreliminary] = useState({
    customerCode: "",
    routeId: "",
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Thêm state để lưu customer được chọn
  const [form, setForm] = useState({
    orderType: "MUA_HO",
    destinationId: 1,
    exchangeRate: 185,
    checkRequired: true,
    note: "",
    orderLinkRequests: [
      {
        productLink: "",
        quantity: 1,
        priceWeb: 0,
        shipWeb: 0,
        productName: "",
        purchaseFee: 0,
        extraCharge: 0,
        purchaseImage: "",
        website: "AMAZON",
        productTypeId: 1,
        groupTag: "A",
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

  const handlePreliminaryChange = (e) => {
    const { name, value } = e.target;
    setPreliminary({ ...preliminary, [name]: value });
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
        console.error("❌ Không tìm thấy URL trong response:", response);
        toast.error("Upload thành công nhưng không lấy được URL ảnh");
        return;
      }

      // Update purchaseImage URL in form
      const updatedProducts = [...form.orderLinkRequests];
      updatedProducts[index].purchaseImage = imageUrl;
      setForm({ ...form, orderLinkRequests: updatedProducts });

      toast.success(`✅ Upload ảnh sản phẩm ${index + 1} thành công!`);
      console.log("✅ Upload thành công, URL đã được set:", imageUrl);
      console.log(
        "✅ Form updated, purchaseImage:",
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
          priceWeb: 0,
          shipWeb: 0,
          productName: "",
          purchaseFee: 0,
          extraCharge: 0,
          purchaseImage: "",
          website: "AMAZON",
          productTypeId: 1,
          groupTag: "A",
        },
      ],
    });
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
        destinationId: 1,
        exchangeRate: 185,
        checkRequired: true,
        note: "",
        orderLinkRequests: [
          {
            productLink: "",
            quantity: 1,
            priceWeb: 0,
            shipWeb: 0,
            productName: "",
            purchaseFee: 0,
            extraCharge: 0,
            purchaseImage: "",
            website: "AMAZON",
            productTypeId: 1,
            groupTag: "A",
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
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Tạo đơn hàng mới</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Đang tải dữ liệu tuyến đường và điểm đến...
          </div>
        )}

        {/* Preliminary Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer Search - Unified Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Tìm kiếm khách hàng *
            </label>

            {/* Unified AccountSearch Component với Clear Button */}
            <div className="relative">
              <AccountSearch
                onSelectAccount={handleSelectCustomer}
                value={preliminary.customerCode}
                onChange={handleCustomerCodeChange}
                onClear={handleClearCustomer} // Prop này sẽ được gọi khi bấm X trong search
              />
              {preliminary.customerCode && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-green-500"
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

            {/* Selected Customer Info - không có nút X nữa */}
            {selectedCustomer && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                    <p className="text-sm font-medium text-blue-900">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-xs text-blue-700">
                      {selectedCustomer.email} • {selectedCustomer.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Route Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Route *
            </label>
            <select
              name="routeId"
              value={preliminary.routeId}
              onChange={handlePreliminaryChange}
              className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                  {route.unitShippingPrice.toLocaleString()} đ)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order Type
            </label>
            <div className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-600">
              Mua hộ
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Destination
            </label>
            <select
              name="destinationId"
              value={form.destinationId}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Exchange Rate
            </label>
            <input
              type="number"
              name="exchangeRate"
              value={form.exchangeRate}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              disabled={!isFormEnabled}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="checkRequired"
              checked={form.checkRequired}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
              disabled={!isFormEnabled}
            />
            <span className="ml-3 text-sm font-semibold text-gray-700">
              Check Required
            </span>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              disabled={!isFormEnabled}
              placeholder="Ghi chú đơn hàng..."
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Danh sách sản phẩm
          </h3>

          {form.orderLinkRequests.map((product, index) => {
            const uploadKey = `product_${index}`;
            const isUploading = uploadingImages[uploadKey];
            const progress = uploadProgress[uploadKey] || 0;
            const preview = imagePreviews[uploadKey];

            return (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl p-6 mb-6 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    Sản phẩm {index + 1}
                  </h4>
                  {index > 0 && (
                    <button
                      onClick={() => {
                        const updatedProducts = form.orderLinkRequests.filter(
                          (_, i) => i !== index
                        );
                        setForm({
                          ...form,
                          orderLinkRequests: updatedProducts,
                        });
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
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
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={product.productName}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      placeholder="Tên sản phẩm..."
                    />
                  </div>

                  {/* Product Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Link
                    </label>
                    <input
                      type="text"
                      name="productLink"
                      value={product.productLink}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      placeholder="https://..."
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      min="1"
                    />
                  </div>

                  {/* Price Web */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Web
                    </label>
                    <input
                      type="number"
                      name="priceWeb"
                      value={product.priceWeb}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Ship Web */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ship Web
                    </label>
                    <input
                      type="number"
                      name="shipWeb"
                      value={product.shipWeb}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Purchase Fee */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Fee
                    </label>
                    <input
                      type="number"
                      name="purchaseFee"
                      value={product.purchaseFee}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type
                    </label>
                    <select
                      name="productTypeId"
                      value={product.productTypeId}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                  {/* Extra Charge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Charge
                    </label>
                    {getProductTypeFee(product.productTypeId) ? (
                      <input
                        type="number"
                        name="extraCharge"
                        value={product.extraCharge}
                        onChange={(e) => handleProductChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
                        Miễn phí (0 VND)
                      </div>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      name="website"
                      value={product.website}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: AMAZON, EBAY, SHOPEE..."
                      disabled={!isFormEnabled}
                    />
                  </div>

                  {/* Group Tag */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Tag
                    </label>
                    <input
                      type="text"
                      name="groupTag"
                      value={product.groupTag}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="A, B, C..."
                      disabled={!isFormEnabled}
                    />
                  </div>
                </div>

                {/* Purchase Image Upload Section */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Purchase Image
                  </label>

                  <div className="flex gap-4 items-start">
                    {/* Upload Button */}
                    <div className="flex-shrink-0">
                      <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 disabled:opacity-50 inline-block transition-colors duration-200">
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
                          className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors duration-200"
                          disabled={!isFormEnabled || isUploading}
                        >
                          Xóa ảnh
                        </button>
                      )}
                    </div>

                    {/* Progress */}
                    {isUploading && (
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">
                          Đang upload... {progress}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Preview/Display */}
                  {(preview || product.purchaseImage) && (
                    <div className="mt-4">
                      <img
                        src={preview || product.purchaseImage}
                        alt={`Product ${index + 1} preview`}
                        className="max-w-xs h-32 object-cover border-2 border-gray-200 rounded-lg shadow-sm"
                      />
                      {product.purchaseImage && (
                        <div className="text-xs text-gray-500 mt-2 break-all bg-gray-100 p-2 rounded-md">
                          <strong>URL:</strong> {product.purchaseImage}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status message when no image */}
                  {!product.purchaseImage && !preview && !isUploading && (
                    <div className="mt-2 text-sm text-gray-500 italic">
                      Chưa có ảnh sản phẩm. Click "Chọn ảnh" để upload.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={addProduct}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
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
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Submit Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {!isFormEnabled && (
                <p className="text-amber-600">
                  ⚠️ Vui lòng chọn Customer Code và Route để tiếp tục
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
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
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
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
