import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronDown,
  AlertCircle,
  CheckCircle,
  User,
  MapPin,
  FileText,
  Banknote,
} from "lucide-react";
import orderService from "../../Services/LeadSale/orderService";
import routesService from "../../Services/StaffSale/routeService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { getAllProductTypes } from "../../Services/Manager/managerProductTypeService";
import toast from "react-hot-toast";
import AccountSearch from "./AccountSearch";
import ProductManager from "./ProducManager";
import ConfirmDialog from "../../common/ConfirmDialog";
import CustomerAddress from "./CustomerAddress";

const CreateOrderForm = () => {
  // Consolidated states
  const [preliminary, setPreliminary] = useState({
    customerCode: "",
    routeId: "",
    addressId: "",
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
      classify: "",
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
    error: null,
  });

  // Confirm
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setUi((prev) => ({ ...prev, error: null }));
        const token = localStorage.getItem("token");

        const [routesData, destinationsData, productTypesData] =
          await Promise.all([
            routesService.getRoutesByAccount(token),
            managerDestinationService.getDestinations(),
            getAllProductTypes(),
          ]);

        setMasterData({
          routes: routesData || [],
          destinations: destinationsData || [],
          productTypes: productTypesData || [],
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
      }
    };

    fetchData();
  }, []);

  // Memoized handlers
  const [shouldLoadAddress, setShouldLoadAddress] = useState(false);
  const handleSelectCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    setPreliminary((prev) => ({
      ...prev,
      customerCode: customer.customerCode,
      addressId: "",
    }));

    // Reset trạng thái load address
    setShouldLoadAddress(false);

    // Hiện toast TRƯỚC
    toast.success(
      `Đã chọn khách hàng: ${customer.name} (${customer.customerCode})`
    );

    // ⏱️ SAU ĐÓ mới cho phép load address (delay 300-500ms)
    setTimeout(() => {
      setShouldLoadAddress(true);
    }, 400); // Có thể điều chỉnh delay này
  }, []);

  const handleCustomerCodeChange = useCallback(
    (e) => {
      const value = e.target.value;
      setPreliminary((prev) => ({
        ...prev,
        customerCode: value,
        addressId: "",
      }));

      if (
        !value ||
        (selectedCustomer && value !== selectedCustomer.customerCode)
      ) {
        setSelectedCustomer(null);
        setShouldLoadAddress(false); // ✨ Reset khi clear
      }
    },
    [selectedCustomer]
  );

  const handleClearCustomer = useCallback(() => {
    setPreliminary((prev) => ({ ...prev, customerCode: "", addressId: "" }));
    setSelectedCustomer(null);
    toast("Đã xóa thông tin khách hàng");
  }, []);

  const handlePreliminaryChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "routeId") {
        const routeIdNum = Number(value || 0);
        const selectedRoute = masterData.routes.find(
          (route) => route.routeId === routeIdNum
        );
        setPreliminary((prev) => ({ ...prev, [name]: routeIdNum }));

        if (selectedRoute?.exchangeRate) {
          setForm((prev) => ({
            ...prev,
            exchangeRate: Number(selectedRoute.exchangeRate) || "",
          }));
          toast.success(
            `Tỷ giá hôm nay: ${Number(
              selectedRoute.exchangeRate || 0
            ).toLocaleString()} VND`
          );
        }
      } else {
        setPreliminary((prev) => ({
          ...prev,
          [name]: name === "addressId" ? Number(value || 0) : value,
        }));
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
          : name === "exchangeRate"
          ? Number(value)
          : value,
    }));
  }, []);

  // Show confirm dialog
  const handleSubmitClick = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  // Close confirm dialog
  const handleCloseDialog = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  // Actual submit function with validation and better error handling
  const handleConfirmSubmit = useCallback(async () => {
    // Validation
    if (!preliminary.customerCode) {
      toast.error("Vui lòng chọn khách hàng");
      setShowConfirmDialog(false);
      return;
    }
    if (!preliminary.routeId) {
      toast.error("Vui lòng chọn tuyến đường");
      setShowConfirmDialog(false);
      return;
    }
    if (!form.destinationId) {
      toast.error("Vui lòng chọn điểm đến");
      setShowConfirmDialog(false);
      return;
    }
    if (!preliminary.addressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      setShowConfirmDialog(false);
      return;
    }
    const exr = Number(form.exchangeRate || 0);
    if (!Number.isFinite(exr) || exr <= 0) {
      toast.error("Tỷ giá phải > 0");
      setShowConfirmDialog(false);
      return;
    }

    // Validate products
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const q = Number(p.quantity);
      const w = Number(p.priceWeb);
      const s = Number(p.shipWeb);

      if (!p.productName?.trim()) {
        toast.error(`Sản phẩm ${i + 1}: Thiếu tên sản phẩm`);
        setShowConfirmDialog(false);
        return;
      }
      if (!p.productLink?.trim()) {
        toast.error(`Sản phẩm ${i + 1}: Thiếu link sản phẩm`);
        setShowConfirmDialog(false);
        return;
      }
      if (!p.website?.trim()) {
        toast.error(`Sản phẩm ${i + 1}: Thiếu thông tin website`);
        setShowConfirmDialog(false);
        return;
      }
      if (!p.productTypeId) {
        toast.error(`Sản phẩm ${i + 1}: Thiếu loại sản phẩm`);
        setShowConfirmDialog(false);
        return;
      }
      if (!Number.isFinite(w) || w <= 0) {
        toast.error(`Sản phẩm ${i + 1}: Giá phải > 0`);
        setShowConfirmDialog(false);
        return;
      }
      if (!Number.isFinite(s) || s < 0) {
        toast.error(`Sản phẩm ${i + 1}: Phí ship ≥ 0`);
        setShowConfirmDialog(false);
        return;
      }
      if (!Number.isFinite(q) || q <= 0) {
        toast.error(`Sản phẩm ${i + 1}: Số lượng phải > 0`);
        setShowConfirmDialog(false);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...form,

        shippingAddressId: Number(preliminary.addressId),
        orderLinkRequests: products.map((p) => ({
          ...p,
          quantity: Number(p.quantity || 0),
          priceWeb: Number(p.priceWeb || 0),
          shipWeb: Number(p.shipWeb || 0),
          productTypeId: Number(p.productTypeId || 0),
        })),
      };

      await orderService.createOrder(
        preliminary.customerCode,
        Number(preliminary.routeId),
        Number(preliminary.addressId),
        orderData
      );

      toast.success("Tạo đơn hàng thành công!");

      // Reset form
      setPreliminary({ customerCode: "", routeId: "", addressId: "" });
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
          classify: "",
          productTypeId: "",
          groupTag: "",
          note: "",
        },
      ]);
    } catch (error) {
      console.error("Error creating order:", error);

      let errorMessage = "Tạo đơn hàng thất bại";
      if (error.response) {
        const backendError =
          error.response.data?.error ||
          error.response.data?.message ||
          error.response.data?.detail ||
          error.response.data?.errors;

        if (backendError) {
          if (
            typeof backendError === "object" &&
            !Array.isArray(backendError)
          ) {
            const errorMessages = Object.entries(backendError)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(", ");
            errorMessage = `Lỗi validation: ${errorMessages}`;
          } else if (Array.isArray(backendError)) {
            errorMessage = backendError.join(", ");
          } else {
            errorMessage = backendError;
          }
        } else {
          errorMessage = `Lỗi ${error.response.status}: ${
            error.response.statusText || "Không xác định"
          }`;
        }
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        errorMessage = error.message || "Đã xảy ra lỗi không xác định";
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  }, [preliminary, form, products]);

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  // Memo cho selectedRoute/destination (chống re-render thừa)
  const selectedRoute = useMemo(
    () =>
      masterData.routes.find(
        (route) => route.routeId === Number(preliminary.routeId)
      ),
    [masterData.routes, preliminary.routeId]
  );

  const selectedDestination = useMemo(
    () =>
      masterData.destinations.find(
        (dest) => dest.destinationId === Number(form.destinationId)
      ),
    [masterData.destinations, form.destinationId]
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Tạo đơn mua hộ</h1>
          </div>

          {ui.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{ui.error}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Form Info */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Customer & Route & Order Details - Combined into ONE Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="space-y-6">
                {/* Customer Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Thông tin khách hàng <span className="text-red-500">*</span>
                  </h3>
                  <AccountSearch
                    onSelectAccount={handleSelectCustomer}
                    value={preliminary.customerCode}
                    onChange={handleCustomerCodeChange}
                    onClear={handleClearCustomer}
                  />
                  {selectedCustomer && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-blue-900">
                        {selectedCustomer.name}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {selectedCustomer.email}
                      </p>
                      <p className="text-xs text-blue-600">
                        {selectedCustomer.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200" />

                {/* Route Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Tuyến đường <span className="text-red-500">*</span>
                  </h3>
                  <div className="relative">
                    <select
                      name="routeId"
                      value={preliminary.routeId}
                      onChange={handlePreliminaryChange}
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                      required
                      disabled={!!ui.error}
                    >
                      <option value="">
                        {ui.error
                          ? "Không thể tải tuyến đường"
                          : "Chọn tuyến đường"}
                      </option>
                      {masterData.routes.map((route) => (
                        <option key={route.routeId} value={route.routeId}>
                          {route.name} ({route.shipTime} ngày,{" "}
                          {(route.unitBuyingPrice ?? 0).toLocaleString()} đ)
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Order Details Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Loại đơn
                    </label>
                    <div className="px-4 py-3 bg-red-100 border border-red-200 rounded-md text-sm font-medium text-red-700">
                      Mua Hộ
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm đến <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="destinationId"
                        value={form.destinationId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                        disabled={!isFormEnabled}
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
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỷ giá (VND) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="exchangeRate"
                        value={form.exchangeRate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Viet Nam Dong (VND)"
                        disabled={!isFormEnabled}
                        min="1"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      name="checkRequired"
                      checked={form.checkRequired}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={!isFormEnabled}
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      Kiểm hàng trước khi giao
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* 👇 CHỈ RENDER CustomerAddress khi đã sẵn sàng */}
                {shouldLoadAddress && preliminary.customerCode && (
                  <CustomerAddress
                    customerCode={preliminary.customerCode}
                    onAddressSelect={(addr) => {
                      setPreliminary((prev) => ({
                        ...prev,
                        addressId: Number(addr.addressId),
                      }));
                    }}
                  />
                )}
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
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Vui lòng chọn khách hàng và tuyến đường để tiếp tục
                  </span>
                </span>
              )}
              {isFormEnabled && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Sẵn sàng tạo đơn mua hộ</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSubmitClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center space-x-2"
              disabled={!isFormEnabled || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Hoàn thành tạo đơn</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ConfirmDialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmSubmit}
          title="Xác nhận tạo đơn mua hộ"
          message={
            <div className="space-y-3">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn tạo đơn mua hộ với thông tin sau:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedCustomer?.name} ({selectedCustomer?.customerCode})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuyến đường:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedRoute?.name}
                  </span>
                </div>
                {selectedDestination && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Điểm đến:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedDestination.destinationName}
                    </span>
                  </div>
                )}
                {form.exchangeRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tỷ giá:</span>
                    <span className="font-semibold text-gray-900">
                      {Number(form.exchangeRate).toLocaleString()} VND
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Số sản phẩm:</span>
                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>
                </div>
              </div>
            </div>
          }
          confirmText="Tạo đơn mua hộ"
          cancelText="Hủy"
          loading={isSubmitting}
          loadingText="Đang tạo đơn"
          type="info"
        />
      </div>
    </div>
  );
};

export default CreateOrderForm;
