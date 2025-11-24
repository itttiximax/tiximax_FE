import React, { useState, useRef, useEffect } from "react";
import {
  createShipment,
  getShipmentInfo,
} from "../../Services/Warehouse/warehouseShipmentService";
import UploadImg from "../../common/UploadImg";
import toast from "react-hot-toast";
import {
  Loader2,
  Package,
  CheckCircle2,
  User,
  Phone,
  Hash,
} from "lucide-react";

const WarehouseShipment = () => {
  const [formData, setFormData] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    image: "",
  });
  const [shipmentId, setShipmentId] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingInfo, setFetchingInfo] = useState(false);

  const shipmentInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    shipmentInputRef.current?.focus();
  }, []);

  // Auto fetch order info when tracking number is entered
  const handleFetchOrderInfo = async (trackingNumber) => {
    if (!trackingNumber.trim()) {
      setOrderInfo(null);
      return;
    }

    setFetchingInfo(true);
    try {
      const data = await getShipmentInfo(trackingNumber.trim());
      setOrderInfo(data);
      toast.success("Order information loaded!");
    } catch (error) {
      setOrderInfo(null);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Order information not found";
      toast.error(errorMsg);
    } finally {
      setFetchingInfo(false);
    }
  };

  // Debounce tracking number input
  const handleTrackingChange = (e) => {
    const value = e.target.value;
    setShipmentId(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer - fetch after 800ms of no typing
    debounceTimerRef.current = setTimeout(() => {
      if (value.trim()) {
        handleFetchOrderInfo(value);
      } else {
        setOrderInfo(null);
      }
    }, 800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (["length", "width", "height", "weight"].includes(name)) {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!shipmentId || !shipmentId.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    if (!orderInfo) {
      toast.error("Please wait for order information to load");
      return;
    }

    if (
      !formData.length ||
      !formData.width ||
      !formData.height ||
      !formData.weight
    ) {
      toast.error("Please fill in all dimension and weight fields");
      return;
    }

    if (
      Number(formData.length) <= 0 ||
      Number(formData.width) <= 0 ||
      Number(formData.height) <= 0 ||
      Number(formData.weight) <= 0
    ) {
      toast.error("Dimensions and weight must be greater than 0");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Checking in shipment...");

    try {
      const shipmentData = {
        length: Number(formData.length),
        width: Number(formData.width),
        height: Number(formData.height),
        weight: Number(formData.weight),
        image: formData.image || "",
      };

      const result = await createShipment(shipmentId.trim(), shipmentData);

      toast.dismiss(loadingToast);

      const successMessage =
        result?.message || result?.data?.message || "Check-in successful!";

      toast.success(successMessage);

      // Reset form
      setFormData({
        length: "",
        width: "",
        height: "",
        weight: "",
        image: "",
      });
      setShipmentId("");
      setOrderInfo(null);
      shipmentInputRef.current?.focus();
    } catch (error) {
      toast.dismiss(loadingToast);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Cannot check in shipment";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !fetchingInfo) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Format status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      CHO_NHAP_KHO_NN: "Pending Import",
      MUA_HO: "Purchase Order",
      DAU_GIA: "Auction Order",
      KY_GUI: "Consignment Order",
      HOAT_DONG: "Active",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="p-6 min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 rounded-xl shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Warehouse Import & Weighing
              </h1>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tracking number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tracking Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  ref={shipmentInputRef}
                  type="text"
                  value={shipmentId}
                  onChange={handleTrackingChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Example: SPX123456678"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  disabled={loading}
                  autoFocus
                />
                {fetchingInfo && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Order Info Card */}
            {orderInfo && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Order Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Order Code */}
                  <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Order Code</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {orderInfo.orders.orderCode}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  {/* <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5">
                    <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900">
                        {getStatusDisplay(orderInfo.orders.status)}
                      </p>
                    </div>
                  </div> */}

                  {/* Customer Code */}
                  <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Customer Code</p>
                      <p className="font-semibold text-gray-900">
                        {orderInfo.customer.customerCode}
                      </p>
                    </div>
                  </div>

                  {/* Order Type */}
                  <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Order Type</p>
                      <p className="font-semibold text-gray-900">
                        {getStatusDisplay(orderInfo.orders.orderType)}
                      </p>
                    </div>
                  </div>
                  {/* Customer Name */}
                  <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600">Customer Name</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {orderInfo.customer.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            {orderInfo && <div className="border-t border-gray-200"></div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Dimensions & weight */}
              <div className="lg:col-span-2 space-y-4">
                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Length <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0"
                        disabled={loading || !orderInfo}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Width <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0"
                        disabled={loading || !orderInfo}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Height <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="0"
                        disabled={loading || !orderInfo}
                      />
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <div className="max-w-xs">
                    <label className="block text-xs text-gray-600 mb-1">
                      Total Weight <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0"
                      disabled={loading || !orderInfo}
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <UploadImg
                  imageUrl={formData.image}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  maxSizeMB={3}
                  placeholder="Upload image (max 3MB)"
                  disabled={!orderInfo}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || fetchingInfo || !orderInfo}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Check In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WarehouseShipment;
