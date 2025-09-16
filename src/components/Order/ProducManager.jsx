import React, { useState, useCallback } from "react";
import uploadImageService from "../../Services/uploadImageService";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import SearchWebsite from "./SearchWebsite";

const ProductManager = ({
  products,
  setProducts,
  productTypes,
  isFormEnabled,
}) => {
  const [ui, setUi] = useState({
    uploadingImages: {},
    deletingImages: {},
  });

  // State để lưu websites đã chọn cho mỗi sản phẩm
  const [selectedWebsites, setSelectedWebsites] = useState({});

  // State để quản lý collapsed products
  const [collapsedProducts, setCollapsedProducts] = useState({});

  // Handler cho việc toggle collapse/expand
  const handleToggleCollapse = useCallback((index) => {
    setCollapsedProducts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // Handler cho việc chọn website từ SearchWebsite
  const handleSelectWebsite = useCallback(
    (index, website) => {
      setProducts((prev) => {
        const updatedProducts = [...prev];
        updatedProducts[index].website = website.websiteName || "";
        return updatedProducts;
      });

      setSelectedWebsites((prev) => ({
        ...prev,
        [index]: website,
      }));

      toast.success(`Đã chọn website: ${website.websiteName}`);
    },
    [setProducts]
  );

  // Handler cho việc xóa website
  const handleClearWebsite = useCallback(
    (index) => {
      setProducts((prev) => {
        const updatedProducts = [...prev];
        updatedProducts[index].website = "";
        return updatedProducts;
      });

      setSelectedWebsites((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });

      toast("Đã xóa thông tin website", { icon: "🗑️" });
    },
    [setProducts]
  );

  // Handler cho việc thay đổi website input thủ công
  const handleWebsiteInputChange = useCallback(
    (index, e) => {
      const value = e.target.value;

      setProducts((prev) => {
        const updatedProducts = [...prev];
        updatedProducts[index].website = value;
        return updatedProducts;
      });

      if (
        selectedWebsites[index] &&
        value !== selectedWebsites[index].websiteName
      ) {
        setSelectedWebsites((prev) => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
      }
    },
    [setProducts, selectedWebsites]
  );

  // Helper function để format số tiền với logic thông minh
  const formatCurrency = (value) => {
    if (!value || value === "") return "";

    const stringValue = value.toString();

    // Không format khi đang nhập số thập phân
    if (
      stringValue.endsWith(".") ||
      (stringValue.includes(".") && stringValue.split(".")[1]?.length === 1)
    ) {
      return stringValue; // Giữ nguyên "12000." hoặc "12000.5"
    }

    const numValue = parseFloat(stringValue.replace(/,/g, ""));
    if (isNaN(numValue)) return "";

    // Format với dấu phẩy ngăn cách hàng nghìn
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Handler khi user blur khỏi quantity input
  const handleQuantityBlur = useCallback(
    (index) => {
      setProducts((prev) => {
        const updatedProducts = [...prev];
        const currentValue = updatedProducts[index].quantity;

        // Nếu để trống hoặc 0, set default về 1
        if (!currentValue || currentValue === "" || currentValue === 0) {
          updatedProducts[index].quantity = 1;
        }

        return updatedProducts;
      });
    },
    [setProducts]
  );
  const handleCurrencyBlur = useCallback(
    (index, fieldName) => {
      setProducts((prev) => {
        const updatedProducts = [...prev];
        const currentValue = updatedProducts[index][fieldName];

        if (currentValue && currentValue !== "") {
          if (fieldName === "purchaseFee") {
            // Xử lý phí mua hộ với %
            const stringValue = currentValue.toString();
            if (stringValue.includes("%")) {
              // Nếu có %, chỉ cần clean up
              const percentValue = stringValue.replace(/,/g, "");
              const numPart = parseFloat(percentValue.replace("%", ""));
              if (!isNaN(numPart) && numPart >= 0) {
                updatedProducts[index][fieldName] = `${numPart}%`;
              }
            } else {
              // Nếu không có %, format như currency bình thường
              const cleanValue = stringValue.replace(/,/g, "");
              const numValue = parseFloat(cleanValue);
              if (!isNaN(numValue) && numValue >= 0) {
                updatedProducts[index][fieldName] = numValue.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }
                );
              }
            }
          } else {
            // Format currency bình thường cho các field khác
            const cleanValue = currentValue.toString().replace(/,/g, "");
            const numValue = parseFloat(cleanValue);

            if (!isNaN(numValue) && numValue >= 0) {
              updatedProducts[index][fieldName] = numValue.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }
              );
            }
          }
        }

        return updatedProducts;
      });
    },
    [setProducts]
  );

  const handleProductChange = useCallback(
    (index, e) => {
      const { name, value } = e.target;
      setProducts((prev) => {
        const updatedProducts = [...prev];

        if (name === "productTypeId") {
          const productTypeId = Number(value);
          const productType = productTypes.find(
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
          // Xử lý các field number (bao gồm price fields)
          if (["priceWeb", "shipWeb", "extraCharge"].includes(name)) {
            // Cho phép nhập tự do, chỉ remove commas và validate
            const cleanValue = value.replace(/,/g, "");
            // Validate chỉ cho phép số và dấu chấm, không cho số âm
            if (/^\d*\.?\d*$/.test(cleanValue) || cleanValue === "") {
              updatedProducts[index][name] = cleanValue;
            }
          } else if (name === "purchaseFee") {
            // Phí mua hộ: cho phép nhập % và số, không cho số âm
            let cleanValue = value.replace(/,/g, "");
            // Validate cho phép số, dấu chấm và dấu %
            if (/^\d*\.?\d*%?$/.test(cleanValue) || cleanValue === "") {
              updatedProducts[index][name] = cleanValue;
            }
          } else if (name === "quantity") {
            // Quantity: cho phép xóa hoàn toàn để nhập số mới, chỉ remove leading zeros
            let cleanValue = value.replace(/^0+/, ""); // Remove leading zeros: 09 → 9
            if (cleanValue === "") {
              // Cho phép để trống khi đang nhập
              updatedProducts[index][name] = "";
            } else {
              const numericValue = Number(cleanValue);
              if (!isNaN(numericValue) && numericValue > 0) {
                updatedProducts[index][name] = numericValue;
              }
            }
          } else {
            // Text fields
            updatedProducts[index][name] = value;
          }
        }

        return updatedProducts;
      });
    },
    [productTypes, setProducts]
  );

  const handleImageUpload = useCallback(
    async (index, file) => {
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

        setProducts((prev) => {
          const updatedProducts = [...prev];
          updatedProducts[index].purchaseImage = imageUrl;
          return updatedProducts;
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
    },
    [setProducts]
  );

  const handleRemoveImage = useCallback(
    async (index) => {
      const currentImage = products[index].purchaseImage;

      if (!currentImage) {
        toast.error("Không có ảnh để xóa");
        return;
      }

      const deleteKey = `product_${index}`;

      try {
        setUi((prev) => ({
          ...prev,
          deletingImages: { ...prev.deletingImages, [deleteKey]: true },
        }));

        try {
          await uploadImageService.deleteByUrl(currentImage);
          console.log("Đã xóa ảnh từ server thành công");
        } catch (deleteError) {
          console.warn("Không thể xóa ảnh từ server:", deleteError);
        }

        setProducts((prev) => {
          const updatedProducts = [...prev];
          updatedProducts[index].purchaseImage = "";
          return updatedProducts;
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
    [products, setProducts]
  );

  const addProduct = useCallback(() => {
    setProducts((prev) => [
      ...prev,
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
  }, [setProducts]);

  const removeProduct = useCallback(
    async (index) => {
      const productToRemove = products[index];

      if (productToRemove.purchaseImage) {
        try {
          await uploadImageService.deleteByUrl(productToRemove.purchaseImage);
          console.log("Đã xóa ảnh sản phẩm khỏi server");
        } catch (error) {
          console.warn("Không thể xóa ảnh sản phẩm:", error);
        }
      }

      setProducts((prev) => prev.filter((_, i) => i !== index));

      setSelectedWebsites((prev) => {
        const updated = {};
        Object.keys(prev).forEach((key) => {
          const oldIndex = parseInt(key);
          if (oldIndex < index) {
            updated[oldIndex] = prev[key];
          } else if (oldIndex > index) {
            updated[oldIndex - 1] = prev[key];
          }
        });
        return updated;
      });

      // Cleanup collapsed state
      setCollapsedProducts((prev) => {
        const updated = {};
        Object.keys(prev).forEach((key) => {
          const oldIndex = parseInt(key);
          if (oldIndex < index) {
            updated[oldIndex] = prev[key];
          } else if (oldIndex > index) {
            updated[oldIndex - 1] = prev[key];
          }
        });
        return updated;
      });

      toast.success("Đã xóa sản phẩm");
    },
    [products, setProducts]
  );

  // Tự động collapse tất cả sản phẩm trừ sản phẩm cuối khi có >= 3 sản phẩm
  const shouldAutoCollapse = (index) => {
    return products.length >= 3 && index < products.length - 1; // Thu gọn tất cả trừ sản phẩm cuối
  };

  const isCollapsed = (index) => {
    if (shouldAutoCollapse(index)) {
      return collapsedProducts[index] !== false; // Default collapsed
    }
    return collapsedProducts[index] === true; // Default expanded
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Danh sách sản phẩm ({products.length})
        </h3>
        <button
          onClick={addProduct}
          className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-1 text-sm"
          disabled={!isFormEnabled}
        >
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="space-y-3 max-h-[700px] overflow-y-auto">
        {products.map((product, index) => {
          const uploadKey = `product_${index}`;
          const deleteKey = `product_${index}`;
          const isUploading = ui.uploadingImages[uploadKey];
          const isDeleting = ui.deletingImages[deleteKey];
          const collapsed = isCollapsed(index);

          return (
            <div
              key={index}
              className={`border border-gray-200 rounded-lg bg-white-50 transition-all duration-200 ${
                collapsed ? "p-3" : "p-4"
              }`}
            >
              {/* Header - Always visible */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-medium text-gray-700">
                    Sản phẩm {index + 1}
                  </span>

                  {/* Compact info when collapsed */}
                  {collapsed && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {product.productName && (
                        <span className="bg-gray-200 px-2 py-1 rounded">
                          {product.productName.substring(0, 20)}
                          {product.productName.length > 20 ? "..." : ""}
                        </span>
                      )}
                      {product.website && (
                        <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">
                          {product.website}
                        </span>
                      )}
                      {product.quantity > 0 && (
                        <span className="bg-green-100 px-2 py-1 rounded text-green-700">
                          SL: {product.quantity}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Collapse/Expand button cho sản phẩm có thể collapse */}
                  {(shouldAutoCollapse(index) ||
                    collapsedProducts[index] !== undefined) && (
                    <button
                      onClick={() => handleToggleCollapse(index)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title={collapsed ? "Mở rộng" : "Thu gọn"}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          collapsed ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Delete button */}
                  {index > 0 && (
                    <button
                      onClick={() => removeProduct(index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 border border-red-300 rounded text-xs hover:bg-red-50"
                      disabled={!isFormEnabled}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {/* Content - Show/Hide based on collapsed state */}
              {!collapsed && (
                <div className="space-y-3">
                  {/* Row 1: Tên sản phẩm, Website, Số lượng */}
                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Tên sản phẩm
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={product.productName}
                        onChange={(e) => handleProductChange(index, e)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        placeholder="Nhập tên sản phẩm..."
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={product.quantity || ""}
                        onChange={(e) => handleProductChange(index, e)}
                        onBlur={() => handleQuantityBlur(index)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Website
                      </label>
                      <SearchWebsite
                        onSelectWebsite={(website) =>
                          handleSelectWebsite(index, website)
                        }
                        value={product.website}
                        onChange={(e) => handleWebsiteInputChange(index, e)}
                        onClear={() => handleClearWebsite(index)}
                      />
                    </div>
                  </div>

                  {/* Row 2: Link sản phẩm */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Link sản phẩm
                    </label>
                    <input
                      type="text"
                      name="productLink"
                      value={product.productLink}
                      onChange={(e) => handleProductChange(index, e)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      placeholder="https://..."
                    />
                  </div>

                  {/* Row 3: Price Info */}
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Giá sản phẩm
                      </label>
                      <input
                        type="text"
                        name="priceWeb"
                        value={product.priceWeb || ""}
                        onChange={(e) => handleProductChange(index, e)}
                        onBlur={() => handleCurrencyBlur(index, "priceWeb")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Phí ship
                      </label>
                      <input
                        type="text"
                        name="shipWeb"
                        value={product.shipWeb || ""}
                        onChange={(e) => handleProductChange(index, e)}
                        onBlur={() => handleCurrencyBlur(index, "shipWeb")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Phí mua hộ ( %)
                      </label>
                      <input
                        type="text"
                        name="purchaseFee"
                        value={product.purchaseFee || ""}
                        onChange={(e) => handleProductChange(index, e)}
                        onBlur={() => handleCurrencyBlur(index, "purchaseFee")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        placeholder=" Nhập phần trăm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Group Tag
                      </label>
                      <input
                        type="text"
                        name="groupTag"
                        value={product.groupTag}
                        onChange={(e) => handleProductChange(index, e)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                        placeholder="A, B, C..."
                      />
                    </div>
                  </div>

                  {/* Row 4: Product Type and Extra Charge */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Loại sản phẩm
                      </label>
                      <select
                        name="productTypeId"
                        value={product.productTypeId}
                        onChange={(e) => handleProductChange(index, e)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!isFormEnabled}
                      >
                        <option value="">Chọn loại sản phẩm</option>
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

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Phụ phí
                      </label>
                      {productTypes.find(
                        (p) => p.productTypeId === product.productTypeId
                      )?.fee ? (
                        <input
                          type="text"
                          name="extraCharge"
                          value={product.extraCharge || ""}
                          onChange={(e) => handleProductChange(index, e)}
                          onBlur={() =>
                            handleCurrencyBlur(index, "extraCharge")
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          disabled={!isFormEnabled}
                          placeholder="0.00"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-gray-100 text-gray-500 flex items-center">
                          Miễn phí (0 VND)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-600">
                        Ảnh sản phẩm
                      </label>
                      <div className="flex space-x-2">
                        <label className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600 disabled:opacity-50 text-xs">
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
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs disabled:opacity-50"
                            disabled={!isFormEnabled || isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Xóa"}
                          </button>
                        )}
                      </div>
                    </div>

                    {product.purchaseImage ? (
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.purchaseImage}
                          alt={`Product ${index + 1}`}
                          className="w-16 h-16 object-cover border border-gray-200 rounded"
                        />
                        <div className="flex-1">
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <div className="flex items-center space-x-1">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs font-medium text-green-800">
                                Ảnh đã upload thành công
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 bg-gray-100 p-3 rounded text-center border-2 border-dashed border-gray-300">
                        <div className="flex flex-col items-center space-y-1">
                          <svg
                            className="w-6 h-6 text-gray-400"
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
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      value={product.note}
                      onChange={(e) => handleProductChange(index, e)}
                      rows="2"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!isFormEnabled}
                      placeholder="Ghi chú cho sản phẩm này..."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductManager;
