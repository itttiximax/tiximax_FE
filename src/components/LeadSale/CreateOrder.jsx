import React, { useState, useEffect } from "react";
import createOrderService from "../../Services/LeadSale/createOrderService";
import routesService from "../../Services/LeadSale/routesService"; // Import routesService

const CreateOrder = () => {
  const [preliminary, setPreliminary] = useState({
    customerCode: "",
    routeId: "",
  });
  const [form, setForm] = useState({
    orderType: "MUA_HO",
    destination: "HA_NOI",
    exchangeRate: 190,
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
  const [routes, setRoutes] = useState([]); // State for routes

  // Fetch routes on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzYWxlIiwiaWF0IjoxNzU2MTA2MjAzLCJleHAiOjE3NTYxOTI2MDN9.h9r_mVrOp_LcLAvseZMSGfe95Kbyn7E2Brjw6a7YGJ1pdZUslrQVET8R_ejSkPQW";
        const data = await routesService.getRoutes(token);
        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  const handlePreliminaryChange = (e) => {
    const { name, value } = e.target;
    setPreliminary({ ...preliminary, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
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
      console.error(error);
      alert("❌ Tạo đơn hàng thất bại");
    }
  };

  const isFormEnabled = preliminary.customerCode && preliminary.routeId;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Order</h2>

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
            >
              <option value="">Chọn tuyến</option>
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
        <div className="grid grid-cols-2 gap-4" disabled={!isFormEnabled}>
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
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              disabled={!isFormEnabled}
            >
              <option value="HA_NOI">HA_NOI</option>
              <option value="HCM">HCM</option>
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
        <h3
          className="text-xl font-semibold mt-6 mb-3"
          disabled={!isFormEnabled}
        >
          Products
        </h3>
        {form.orderLinkRequests.map((product, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
            disabled={!isFormEnabled}
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
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={!isFormEnabled}
        >
          + Add Product
        </button>

        {/* Submit */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
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
