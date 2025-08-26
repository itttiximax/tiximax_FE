import React, { useState, useEffect } from "react";
import createOrderService from "../../Services/LeadSale/createOrderService";
import routesService from "../../Services/LeadSale/routesService";
import destinationService from "../../Services/LeadSale/destinationService";

const CreateOrder = () => {
  const [preliminary, setPreliminary] = useState({
    customerCode: "",
    routeId: "",
  });
  const [form, setForm] = useState({
    orderType: "MUA_HO",
    destinationId: 1, // Changed from destination to destinationId
    exchangeRate: 185, // Updated default value
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
        purchaseImage: "",
        website: "AMAZON",
        productType: "DO_DIEN_TU",
        groupTag: "A",
      },
    ],
  });
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch routes and destinations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage instead of hardcoding
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          return;
        }

        // Fetch routes and destinations concurrently
        const [routesData, destinationsData] = await Promise.all([
          routesService.getRoutes(token),
          destinationService.getDestinations(token),
        ]);

        setRoutes(routesData);
        setDestinations(destinationsData);
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
    updatedProducts[index][name] = [
      "quantity",
      "priceWeb",
      "shipWeb",
      "purchaseFee",
    ].includes(name)
      ? Number(value)
      : value;
    setForm({ ...form, orderLinkRequests: updatedProducts });
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
          purchaseImage: "",
          website: "AMAZON",
          productType: "DO_DIEN_TU",
          groupTag: "A",
        },
      ],
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await createOrderService(
        preliminary.customerCode,
        preliminary.routeId,
        form
      );
      console.log("✅ Order created:", result);
      alert("Tạo đơn hàng thành công!");
    } catch (error) {
      console.error("Error creating order:", error);

      // Hiển thị lỗi cụ thể từ server
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Tạo đơn hàng thất bại";

      alert(`❌ ${errorMessage}`);
    }
  };

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Order</h2>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Loading Display */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Đang tải dữ liệu tuyến đường và điểm đến...
          </div>
        )}

        {/* Preliminary Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold">Customer Code *</label>
            <p className="text-sm text-gray-500 mb-1">Mã khách hàng</p>
            <input
              type="text"
              name="customerCode"
              value={preliminary.customerCode}
              onChange={handlePreliminaryChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Route *</label>
            <p className="text-sm text-gray-500 mb-1">Chọn tuyến đường</p>
            <select
              name="routeId"
              value={preliminary.routeId}
              onChange={handlePreliminaryChange}
              className="w-full border rounded px-3 py-2"
              required
              disabled={loading || error}
            >
              <option value="">
                {loading
                  ? "Đang tải..."
                  : error
                  ? "Không thể tải tuyến đường"
                  : "Chọn tuyến"}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Order Type</label>
            <p className="text-sm text-gray-500 mb-1">
              Kiểu đơn hàng (VD: MUA_HO, ký gửi…)
            </p>
            <select
              name="orderType"
              value={form.orderType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={!isFormEnabled}
            >
              <option value="MUA_HO">MUA_HO</option>
              <option value="KHAC">KHÁC</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Destination</label>
            <p className="text-sm text-gray-500 mb-1">
              Điểm đến cuối cùng của đơn hàng
            </p>
            <select
              name="destinationId"
              value={form.destinationId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
            <label className="block font-semibold">Exchange Rate</label>
            <p className="text-sm text-gray-500 mb-1">
              Tỷ giá áp dụng (VD: 190)
            </p>
            <input
              type="number"
              name="exchangeRate"
              value={form.exchangeRate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={!isFormEnabled}
            />
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="checkRequired"
              checked={form.checkRequired}
              onChange={handleChange}
              className="mr-2"
              disabled={!isFormEnabled}
            />
            <span className="font-semibold">Check Required</span>
          </div>

          <div className="col-span-2">
            <label className="block font-semibold">Note</label>
            <p className="text-sm text-gray-500 mb-1">
              Ghi chú thêm cho đơn hàng
            </p>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={!isFormEnabled}
            />
          </div>
        </div>

        {/* Products */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Products</h3>
        {form.orderLinkRequests.map((product, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">Product Name</label>
                <p className="text-sm text-gray-500 mb-1">
                  Tên sản phẩm để dễ nhận diện
                </p>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Product Link</label>
                <p className="text-sm text-gray-500 mb-1">
                  Link sản phẩm trên website
                </p>
                <input
                  type="text"
                  name="productLink"
                  value={product.productLink}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Quantity</label>
                <p className="text-sm text-gray-500 mb-1">
                  Số lượng sản phẩm cần mua
                </p>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Price Web</label>
                <p className="text-sm text-gray-500 mb-1">
                  Giá sản phẩm trên website
                </p>
                <input
                  type="number"
                  name="priceWeb"
                  value={product.priceWeb}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Ship Web</label>
                <p className="text-sm text-gray-500 mb-1">
                  Phí ship nội bộ trên website
                </p>
                <input
                  type="number"
                  name="shipWeb"
                  value={product.shipWeb}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Purchase Fee</label>
                <p className="text-sm text-gray-500 mb-1">
                  Phí dịch vụ mua hộ (nếu có)
                </p>
                <input
                  type="number"
                  name="purchaseFee"
                  value={product.purchaseFee}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Purchase Image</label>
                <p className="text-sm text-gray-500 mb-1">
                  Link ảnh sản phẩm (tùy chọn)
                </p>
                <input
                  type="text"
                  name="purchaseImage"
                  value={product.purchaseImage}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              <div>
                <label className="font-semibold">Website</label>
                <p className="text-sm text-gray-500 mb-1">
                  Website mua hàng (AMAZON, EBAY…)
                </p>
                <select
                  name="website"
                  value={product.website}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                >
                  <option value="AMAZON">AMAZON</option>
                  <option value="EBAY">EBAY</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">Product Type</label>
                <p className="text-sm text-gray-500 mb-1">
                  Loại sản phẩm (ĐỒ ĐIỆN TỬ, THỜI TRANG…)
                </p>
                <select
                  name="productType"
                  value={product.productType}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                >
                  <option value="DO_DIEN_TU">ĐỒ ĐIỆN TỬ</option>
                  <option value="THOI_TRANG">THỜI TRANG</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">Group Tag</label>
                <p className="text-sm text-gray-500 mb-1">
                  Nhóm sản phẩm (A, B… để gom đơn)
                </p>
                <input
                  type="text"
                  name="groupTag"
                  value={product.groupTag}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProduct}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
          disabled={!isFormEnabled}
        >
          + Add Product
        </button>

        {/* Submit */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!isFormEnabled}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
