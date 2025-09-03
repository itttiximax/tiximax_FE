import React, { useState, useEffect } from "react";
import orderService from "../../Services/LeadSale/orderService";
import routesService from "../..//Services/StaffSale/routeService";
import managerDestinationService from "../../Services/Manager/managerDestinationService";
import { getAllProductTypes } from "../../Services/Manager/managerProductTypeService";

const CreateOrder = () => {
  const [preliminary, setPreliminary] = useState({
    customerCode: "",
    routeId: "",
  });
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token"); // token từ localStorage

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
      alert("Tạo đơn hàng thành công!");
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Tạo đơn hàng thất bại";
      alert(`${errorMessage}`);
    }
  };

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Order</h2>

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
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold">Customer Code *</label>
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
            <div className="w-full border rounded px-3 py-2 bg-gray-100">
              Mua hộ
            </div>
          </div>

          <div>
            <label className="block font-semibold">Destination</label>
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
              {/* Product Name */}
              <div>
                <label className="font-semibold">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Product Link */}
              <div>
                <label className="font-semibold">Product Link</label>
                <input
                  type="text"
                  name="productLink"
                  value={product.productLink}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="font-semibold">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Price Web */}
              <div>
                <label className="font-semibold">Price Web</label>
                <input
                  type="number"
                  name="priceWeb"
                  value={product.priceWeb}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Ship Web */}
              <div>
                <label className="font-semibold">Ship Web</label>
                <input
                  type="number"
                  name="shipWeb"
                  value={product.shipWeb}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Purchase Fee */}
              <div>
                <label className="font-semibold">Purchase Fee</label>
                <input
                  type="number"
                  name="purchaseFee"
                  value={product.purchaseFee}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Product Type */}
              <div>
                <label className="font-semibold">Product Type</label>
                <select
                  name="productTypeId"
                  value={product.productTypeId}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled || loading}
                >
                  <option value="">
                    {loading ? "Đang tải..." : "Chọn loại sản phẩm"}
                  </option>
                  {productTypes.map((type) => (
                    <option key={type.productTypeId} value={type.productTypeId}>
                      {type.productTypeName}{" "}
                      {type.fee ? "(Có phí)" : "(Miễn phí)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Extra Charge */}
              <div>
                <label className="font-semibold">Extra Charge</label>
                {getProductTypeFee(product.productTypeId) ? (
                  <input
                    type="number"
                    name="extraCharge"
                    value={product.extraCharge}
                    onChange={(e) => handleProductChange(index, e)}
                    className="border rounded px-3 py-2 w-full"
                    disabled={!isFormEnabled}
                  />
                ) : (
                  <div className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-500">
                    Miễn phí (0 VND)
                  </div>
                )}
              </div>

              {/* Purchase Image */}
              <div>
                <label className="font-semibold">Purchase Image</label>
                <input
                  type="text"
                  name="purchaseImage"
                  value={product.purchaseImage}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Website */}
              <div>
                <label className="font-semibold">Website</label>
                <input
                  type="text"
                  name="website"
                  value={product.website}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="VD: AMAZON, EBAY, SHOPEE..."
                  disabled={!isFormEnabled}
                />
              </div>

              {/* Group Tag */}
              <div>
                <label className="font-semibold">Group Tag</label>
                <input
                  type="text"
                  name="groupTag"
                  value={product.groupTag}
                  onChange={(e) => handleProductChange(index, e)}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="A, B, C..."
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
          Add Product
        </button>

        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!isFormEnabled}
          >
            Hoàn tất đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
