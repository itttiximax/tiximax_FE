// src/Components/StaffPurchase/OrderLinkList.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  XCircle,
  Clock,
  Star,
  StarOff,
  Store,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import orderlinkService from "../../Services/StaffPurchase/orderlinkService";
import DetailOrderLink from "./DetailOrderLink";
import CreatePurchase from "./CreatePurchase";
import CancelPurchase from "./CancelPurchase";
import PurchaseLater from "./PurchaseLater";
import PinOrder from "./PinOrder";

const OrderLinkList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 15,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });
  const [showCreatePurchase, setShowCreatePurchase] = useState(false);
  const [selectedOrderForPurchase, setSelectedOrderForPurchase] =
    useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Selected links for purchase with shop tracking
  const [selectedLinksForPurchase, setSelectedLinksForPurchase] = useState({});

  // Cancel Purchase
  const [showCancelPurchase, setShowCancelPurchase] = useState(false);
  const [selectedLinkForCancel, setSelectedLinkForCancel] = useState(null);

  // Purchase Later
  const [showPurchaseLater, setShowPurchaseLater] = useState(false);
  const [selectedLinkForBuyLater, setSelectedLinkForBuyLater] = useState(null);

  // Pin Order
  const [showPin, setShowPin] = useState(false);
  const [pinCtx, setPinCtx] = useState(null);

  // Color palette cho shop badges
  const shopColorPalette = [
    { bg: "bg-blue-500", text: "text-white", border: "border-blue-100" },
    { bg: "bg-green-500", text: "text-white", border: "border-green-100" },
    { bg: "bg-purple-500", text: "text-white", border: "border-purple-100" },
    { bg: "bg-amber-500", text: "text-white", border: "border-amber-100" },
    { bg: "bg-pink-500", text: "text-white", border: "border-pink-100" },
    { bg: "bg-indigo-500", text: "text-white", border: "border-indigo-100" },
    { bg: "bg-cyan-500", text: "text-white", border: "border-cyan-100" },
    { bg: "bg-rose-500", text: "text-white", border: "border-rose-100" },
    { bg: "bg-teal-500", text: "text-white", border: "border-teal-100" },
    { bg: "bg-violet-500", text: "text-white", border: "border-violet-100" },
  ];

  const getShopColor = (shopName, orderLinks) => {
    if (!shopName || shopName === "string" || shopName === "N/A") {
      return {
        bg: "bg-red-600",
        text: "text-white",
        border: "border-gray-100",
      };
    }

    const uniqueShops = [
      ...new Set(
        orderLinks
          .map((l) => l.groupTag)
          .filter((g) => g && g !== "string" && g !== "N/A")
      ),
    ];

    if (uniqueShops.length <= 1) {
      return {
        bg: "bg-amber-500",
        text: "text-white",
        border: "border-gray-100",
      };
    }

    let hash = 0;
    for (let i = 0; i < shopName.length; i++) {
      hash = shopName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colorIndex = Math.abs(hash) % shopColorPalette.length;
    return shopColorPalette[colorIndex];
  };

  // Get selected shop for an order
  const getSelectedShop = (orderId, orderLinks) => {
    const selections = selectedLinksForPurchase[orderId] || {};
    const selectedLinkIds = Object.keys(selections);

    if (selectedLinkIds.length === 0) return null;

    const firstSelectedLink = orderLinks.find((link) =>
      selectedLinkIds.includes(link.linkId.toString())
    );

    return firstSelectedLink?.groupTag || null;
  };

  // Calculate total price of selected links
  const getSelectedTotal = (orderId, orderLinks) => {
    const selections = selectedLinksForPurchase[orderId] || {};
    const selectedLinkIds = Object.keys(selections);

    if (selectedLinkIds.length === 0) return 0;

    const selectedLinks = orderLinks.filter((link) =>
      selectedLinkIds.includes(link.linkId.toString())
    );

    return selectedLinks.reduce((total, link) => {
      return total + (link.totalWeb || 0);
    }, 0);
  };

  const fetchOrders = useCallback(async (page = 0, size = 15) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderlinkService.getOrdersWithLinks(
        page,
        size,
        "MUA_HO"
      );

      if (response?.content) {
        setOrders(response.content);
        setPagination({
          pageNumber: response.number ?? page,
          pageSize: response.size ?? size,
          totalPages: response.totalPages ?? 0,
          totalElements: response.totalElements ?? 0,
          first: response.first ?? page === 0,
          last: response.last ?? true,
        });
      } else {
        setOrders([]);
        setPagination((prev) => ({ ...prev, totalElements: 0, totalPages: 0 }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tải danh sách đơn hàng";
      setError(errorMessage);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (
        newPage >= 0 &&
        newPage < pagination.totalPages &&
        newPage !== pagination.pageNumber
      ) {
        fetchOrders(newPage, pagination.pageSize);
      }
    },
    [
      fetchOrders,
      pagination.pageNumber,
      pagination.pageSize,
      pagination.totalPages,
    ]
  );

  const handleViewDetail = useCallback((linkId) => {
    setSelectedLinkId(linkId);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedLinkId(null);
  }, []);

  const toggleExpandOrder = useCallback((orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  // Toggle select link with shop validation
  const toggleSelectLink = (
    orderId,
    linkId,
    trackingCode,
    shopName,
    orderLinks
  ) => {
    const currentSelections = selectedLinksForPurchase[orderId] || {};
    const isCurrentlySelected = currentSelections[linkId];

    // If deselecting, just remove it
    if (isCurrentlySelected) {
      const { [linkId]: removed, ...rest } = currentSelections;
      setSelectedLinksForPurchase((prev) => ({
        ...prev,
        [orderId]: rest,
      }));
      return;
    }

    // If selecting, check shop constraint
    const selectedShop = getSelectedShop(orderId, orderLinks);

    if (selectedShop && selectedShop !== shopName) {
      toast.error(
        `Chỉ được chọn sản phẩm cùng shop!\nĐã chọn: ${selectedShop}\nBạn đang chọn: ${shopName}`,
        { duration: 4000 }
      );
      return;
    }

    // Valid selection
    setSelectedLinksForPurchase((prev) => ({
      ...prev,
      [orderId]: {
        ...currentSelections,
        [linkId]: trackingCode,
      },
    }));
  };

  // Select all links in order - only same shop
  const selectAllLinksInOrder = (order, selectAll) => {
    if (!selectAll) {
      // Deselect all
      setSelectedLinksForPurchase((prev) => {
        const { [order.orderId]: removed, ...rest } = prev;
        return rest;
      });
      return;
    }

    // Select all available links
    const availableLinks = order.orderLinks.filter(
      (link) => !["DA_MUA", "HUY", "DA_HUY"].includes(link.status)
    );

    if (availableLinks.length === 0) return;

    // Group by shop
    const linksByShop = {};
    availableLinks.forEach((link) => {
      const shop = link.groupTag || "N/A";
      if (!linksByShop[shop]) {
        linksByShop[shop] = [];
      }
      linksByShop[shop].push(link);
    });

    // If multiple shops, ask user to select manually
    if (Object.keys(linksByShop).length > 1) {
      toast.error(
        "Đơn hàng có nhiều shop khác nhau. Vui lòng chọn từng sản phẩm cùng shop!",
        { duration: 4000 }
      );
      return;
    }

    // Select all from the only shop
    const selections = {};
    availableLinks.forEach((link) => {
      selections[link.linkId] = link.trackingCode;
    });

    setSelectedLinksForPurchase((prev) => ({
      ...prev,
      [order.orderId]: selections,
    }));
  };

  const handleCreatePurchase = useCallback(
    (order) => {
      if (!order.orderLinks?.length) return;

      const selectedCount = Object.keys(
        selectedLinksForPurchase[order.orderId] || {}
      ).length;

      if (selectedCount === 0) {
        toast.error("Vui lòng chọn ít nhất một sản phẩm để mua hộ");
        return;
      }

      // Validate same shop
      const selections = selectedLinksForPurchase[order.orderId] || {};
      const selectedLinkIds = Object.keys(selections);
      const selectedLinks = order.orderLinks.filter((link) =>
        selectedLinkIds.includes(link.linkId.toString())
      );

      const shops = [...new Set(selectedLinks.map((link) => link.groupTag))];

      if (shops.length > 1) {
        toast.error("Các sản phẩm đã chọn phải cùng shop!");
        return;
      }

      setSelectedOrderForPurchase(order);
      setShowCreatePurchase(true);
    },
    [selectedLinksForPurchase]
  );

  const handleCloseCreatePurchase = useCallback(() => {
    setShowCreatePurchase(false);
    setSelectedOrderForPurchase(null);
  }, []);

  const handlePurchaseSuccess = useCallback(() => {
    // Clear selections for this order
    if (selectedOrderForPurchase) {
      setSelectedLinksForPurchase((prev) => {
        const { [selectedOrderForPurchase.orderId]: removed, ...rest } = prev;
        return rest;
      });
    }
    fetchOrders(pagination.pageNumber, pagination.pageSize);
  }, [
    fetchOrders,
    pagination.pageNumber,
    pagination.pageSize,
    selectedOrderForPurchase,
  ]);

  const handleCancelPurchase = useCallback((order, link) => {
    setSelectedLinkForCancel({
      orderId: order.orderId,
      linkId: link.linkId,
      orderCode: order.orderCode,
      linkInfo: {
        productName: link.productName,
        trackingCode: link.trackingCode,
        status: link.status,
      },
    });
    setShowCancelPurchase(true);
  }, []);

  const handleCloseCancelPurchase = useCallback(() => {
    setShowCancelPurchase(false);
    setSelectedLinkForCancel(null);
  }, []);

  const handleCancelSuccess = useCallback(
    (_linkId, _orderId) => {
      fetchOrders(pagination.pageNumber, pagination.pageSize);
    },
    [fetchOrders, pagination.pageNumber, pagination.pageSize]
  );

  const handleOpenPurchaseLater = useCallback((order, link) => {
    setSelectedLinkForBuyLater({
      orderId: order.orderId,
      linkId: link.linkId,
      orderCode: order.orderCode,
      linkInfo: {
        productName: link.productName,
        trackingCode: link.trackingCode,
        status: link.status,
      },
    });
    setShowPurchaseLater(true);
  }, []);

  const handleClosePurchaseLater = useCallback(() => {
    setShowPurchaseLater(false);
    setSelectedLinkForBuyLater(null);
  }, []);

  const handlePurchaseLaterSuccess = useCallback(() => {
    fetchOrders(pagination.pageNumber, pagination.pageSize);
  }, [fetchOrders, pagination.pageNumber, pagination.pageSize]);

  const openPin = useCallback((order) => {
    setPinCtx({
      orderId: order.orderId,
      orderCode: order.orderCode,
      pinned: !!order.pinnedAt,
    });
    setShowPin(true);
  }, []);

  const closePin = useCallback(() => {
    setShowPin(false);
    setPinCtx(null);
  }, []);

  const handlePinSuccess = useCallback((orderId, desiredPin) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId !== orderId) return o;
        return {
          ...o,
          pinnedAt: desiredPin ? o.pinnedAt || new Date().toISOString() : null,
        };
      })
    );
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      CHO_MUA: "bg-yellow-100 text-yellow-800",
      DANG_MUA: "bg-blue-100 text-blue-800",
      DA_MUA: "bg-red-600 text-white",
      HUY: "bg-red-100 text-red-800",
      DA_HUY: "bg-red-600 text-white",
      HOAT_DONG: "bg-green-100 text-green-800",
      MUA_SAU: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      CHO_MUA: "Chờ mua",
      DANG_MUA: "Đang mua",
      DA_MUA: "Đã mua",
      HUY: "Đã hủy",
      HOAT_DONG: "Hoạt động",
      DA_HUY: "Đã hủy",
      MUA_SAU: "Mua sau",
    };
    return texts[status] || status;
  };

  const filteredOrders = orders
    .filter((order) =>
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) =>
      filterDate
        ? new Date(order.createdAt).toISOString().slice(0, 10) === filterDate
        : true
    );

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination((prev) => ({ ...prev, pageSize: newSize }));
    fetchOrders(0, newSize);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-blue-600">
              Danh Sách Đơn Hàng Mua Hộ
            </h1>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center">
              <Eye className="w-4 h-4 text-red-400 mr-2" />
              <div>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => fetchOrders()}
                  className="text-red-600 hover:text-red-800 text-xs underline mt-1"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <select
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
              >
                <option value={10}>10 / trang</option>
                <option value={15}>15 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={30}>30 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center px-3 py-2 font-semibold leading-5 text-sm text-blue-600">
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" />
              Đang tải dữ liệu...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm
                ? "Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm."
                : "Hiện tại chưa có đơn hàng mua hộ nào trong hệ thống."}
            </p>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <div className="space-y-3">
            {filteredOrders.map((order, index) => {
              const isPinned = !!order.pinnedAt;
              const availableLinks =
                order.orderLinks?.filter(
                  (link) => !["DA_MUA", "HUY", "DA_HUY"].includes(link.status)
                ) || [];
              const selectedCount = Object.keys(
                selectedLinksForPurchase[order.orderId] || {}
              ).length;
              const selectedShop = getSelectedShop(
                order.orderId,
                order.orderLinks || []
              );
              const selectedTotal = getSelectedTotal(
                order.orderId,
                order.orderLinks || []
              );
              const isAllSelected =
                availableLinks.length > 0 &&
                availableLinks.every(
                  (link) =>
                    selectedLinksForPurchase[order.orderId]?.[link.linkId]
                );

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div
                    className={`px-4 py-3 border-b border-gray-200 ${
                      isPinned ? "bg-yellow-100" : "bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">
                            {pagination.pageNumber * pagination.pageSize +
                              index +
                              1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            {order.orderCode}
                            <button
                              onClick={() => openPin(order)}
                              className={`inline-flex items-center justify-center rounded-full p-1 transition-colors ${
                                isPinned
                                  ? "text-amber-600 hover:text-amber-700"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                              title={isPinned ? "Bỏ ghim đơn" : "Ghim đơn"}
                            >
                              {isPinned ? (
                                <Star className="w-4 h-4" />
                              ) : (
                                <StarOff className="w-4 h-4" />
                              )}
                            </button>
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                            <span className="font-medium">
                              {formatDate(order.createdAt)}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Mua hộ
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="text-base font-bold text-gray-900 flex items-center gap-1">
                            {formatCurrency(order.finalPriceOrder)}
                          </div>
                          <div className="text-xs text-black-500 font-semibold">
                            Tổng tiền
                          </div>
                        </div>
                        {availableLinks.length > 0 && (
                          <button
                            onClick={() => handleCreatePurchase(order)}
                            disabled={selectedCount === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-medium hover:from-green-600 hover:to-green-700 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            <Plus className="w-3 h-3" />
                            Mua hộ ({selectedCount})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shop Warning with Total */}
                  {selectedShop && selectedCount > 0 && (
                    <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                            <Store className="w-4 h-4 text-amber-700" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-amber-900">
                              <span className="font-medium">
                                Đang chọn shop:
                              </span>
                              <span className="font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                                {selectedShop}
                              </span>
                              <span className="text-xs font-bold text-red-700  px-2 py-0.5 rounded border border-red-300">
                                Chỉ được chọn sản phẩm cùng shop
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl text-black-700 font-medium">
                            Tổng tiền thu:
                          </div>
                          <div className="text-lg font-bold text-amber-900">
                            {formatCurrency(selectedTotal)} ₫
                          </div>
                          {/* <div className="text-xs form-medium text-black-600">
                            ( {selectedCount} sản phẩm )
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Content */}
                  <div className="p-4">
                    {order.orderLinks?.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                            <Package className="w-3 h-3" />
                            Sản phẩm ({order.orderLinks.length})
                          </h4>
                          <div className="flex items-center gap-3">
                            {availableLinks.length > 0 && (
                              <button
                                onClick={() =>
                                  selectAllLinksInOrder(order, !isAllSelected)
                                }
                                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                {isAllSelected ? (
                                  <>
                                    <CheckSquare className="w-3 h-3" />
                                    Bỏ chọn tất cả
                                  </>
                                ) : (
                                  <>
                                    <Square className="w-3 h-3" />
                                    Chọn tất cả
                                  </>
                                )}
                              </button>
                            )}
                            {order.orderLinks.length > 2 && (
                              <button
                                onClick={() => toggleExpandOrder(order.orderId)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                              >
                                {expandedOrders[order.orderId] ? (
                                  <>
                                    <ChevronUp className="w-3 h-3" />
                                    Thu gọn
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3" />
                                    Xem tất cả
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {(order.orderLinks.length <= 2 ||
                          expandedOrders[order.orderId]
                            ? order.orderLinks
                            : order.orderLinks.slice(0, 2)
                          ).map((link) => {
                            const shopColor = getShopColor(
                              link.groupTag,
                              order.orderLinks
                            );
                            const isDisabled = [
                              "DA_MUA",
                              "HUY",
                              "DA_HUY",
                            ].includes(link.status);
                            const isSelected =
                              selectedLinksForPurchase[order.orderId]?.[
                                link.linkId
                              ];
                            const isDifferentShop =
                              selectedShop && selectedShop !== link.groupTag;

                            return (
                              <div
                                key={link.linkId}
                                className={`border rounded-lg p-3 transition-all ${
                                  isSelected
                                    ? "bg-green-50 border-green-300 ring-2 ring-green-200"
                                    : isDifferentShop
                                    ? "bg-gray-100 border-gray-300 opacity-50"
                                    : "bg-gradient-to-r from-gray-50 to-gray-50 border-gray-200"
                                } ${isDisabled ? "opacity-60" : ""}`}
                              >
                                <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
                                  {/* Checkbox Column */}
                                  <div className="lg:col-span-1 flex items-center justify-center">
                                    {!isDisabled && !isDifferentShop ? (
                                      <button
                                        onClick={() =>
                                          toggleSelectLink(
                                            order.orderId,
                                            link.linkId,
                                            link.trackingCode,
                                            link.groupTag,
                                            order.orderLinks
                                          )
                                        }
                                        className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                      >
                                        {isSelected ? (
                                          <CheckSquare className="w-6 h-6 text-green-600" />
                                        ) : (
                                          <Square className="w-6 h-6 text-gray-400" />
                                        )}
                                        <span className="text-xs text-gray-600 font-medium">
                                          {isSelected ? "Đã chọn" : "Chọn"}
                                        </span>
                                      </button>
                                    ) : (
                                      <div className="flex flex-col items-center gap-2 p-2">
                                        <XCircle className="w-6 h-6 text-gray-300" />
                                        <span className="text-xs text-gray-400 text-center font-medium">
                                          {isDifferentShop
                                            ? "Shop khác"
                                            : "Không khả dụng"}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Shop Column */}
                                  <div className="lg:col-span-1">
                                    <div
                                      className={`${shopColor.bg} ${shopColor.text} ${shopColor.border} border-2 rounded-lg p-3 h-full flex flex-col items-center justify-center text-center shadow-sm`}
                                    >
                                      <Store className="w-5 h-5 mb-1.5" />
                                      <div className="font-bold text-sm break-words">
                                        {link.groupTag !== "string"
                                          ? link.groupTag
                                          : "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Product Info */}
                                  <div className="lg:col-span-1">
                                    <div className="font-medium text-gray-900 mb-1 text-sm">
                                      {link.productName !== "string"
                                        ? link.productName
                                        : "Tên sản phẩm"}
                                    </div>
                                    <div className="space-y-0.5 text-xs text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <ExternalLink className="w-2.5 h-2.5" />
                                        {link.website !== "string"
                                          ? link.website
                                          : "N/A"}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {link.trackingCode}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Pricing Info */}
                                  <div className="lg:col-span-1">
                                    <div className="space-y-0.5 text-xs">
                                      <div className="text-gray-600">
                                        SL:{" "}
                                        <span className="font-medium">
                                          {link.quantity}
                                        </span>
                                      </div>
                                      <div className="text-gray-600">
                                        Giá web:{" "}
                                        <span className="font-medium">
                                          {link.priceWeb?.toLocaleString() || 0}
                                        </span>
                                      </div>
                                      <div className="text-gray-600">
                                        Giá Ship:{" "}
                                        <span className="font-medium">
                                          {link.shipWeb?.toLocaleString() || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Additional Info */}
                                  <div className="lg:col-span-1">
                                    <div className="space-y-0.5 text-xs text-gray-600">
                                      <div>
                                        Phân loại:{" "}
                                        <span className="font-medium">
                                          {link.classify !== "string"
                                            ? link.classify
                                            : "N/A"}
                                        </span>
                                      </div>
                                      <div>
                                        Note:{" "}
                                        <span className="font-medium">
                                          {link.note || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Actions & Status */}
                                  <div className="lg:col-span-1 text-right">
                                    <div className="text-sm font-semibold text-gray-900 mb-2">
                                      {formatCurrency(link.totalWeb)} ₫
                                    </div>
                                    <div className="flex flex-col gap-1.5 items-end">
                                      <span
                                        className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                          link.status
                                        )}`}
                                      >
                                        {getStatusText(link.status)}
                                      </span>
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() =>
                                            handleViewDetail(link.linkId)
                                          }
                                          className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors"
                                        >
                                          <Eye className="w-2.5 h-2.5" />
                                          Chi tiết
                                        </button>

                                        {link.status !== "HUY" &&
                                          link.status !== "DA_MUA" &&
                                          link.status !== "MUA_SAU" && (
                                            <button
                                              onClick={() =>
                                                handleOpenPurchaseLater(
                                                  order,
                                                  link
                                                )
                                              }
                                              className="flex items-center gap-1 bg-indigo-500 text-white px-2 py-1 rounded-md text-xs hover:bg-indigo-600 transition-colors"
                                              title="Đưa link sang Mua sau"
                                            >
                                              <Clock className="w-2.5 h-2.5" />
                                              Mua sau
                                            </button>
                                          )}

                                        {link.status !== "HUY" &&
                                          link.status !== "DA_MUA" && (
                                            <button
                                              onClick={() =>
                                                handleCancelPurchase(
                                                  order,
                                                  link
                                                )
                                              }
                                              className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600 transition-colors"
                                              title="Hủy đơn hàng"
                                            >
                                              <XCircle className="w-2.5 h-2.5" />
                                              Hủy
                                            </button>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs text-yellow-800">
                            Đơn hàng chưa có sản phẩm nào
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-4 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
            <button
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              disabled={pagination.first}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pagination.first
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Trang trước
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Trang</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                {pagination.pageNumber + 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              disabled={pagination.last}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pagination.last
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Trang sau
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePurchase
        isOpen={showCreatePurchase}
        onClose={handleCloseCreatePurchase}
        orderCode={selectedOrderForPurchase?.orderCode}
        selectedTrackingCodes={
          selectedOrderForPurchase
            ? Object.values(
                selectedLinksForPurchase[selectedOrderForPurchase.orderId] || {}
              )
            : []
        }
        onSuccess={handlePurchaseSuccess}
      />

      <CancelPurchase
        isOpen={showCancelPurchase}
        onClose={handleCloseCancelPurchase}
        orderId={selectedLinkForCancel?.orderId}
        linkId={selectedLinkForCancel?.linkId}
        orderCode={selectedLinkForCancel?.orderCode}
        linkInfo={selectedLinkForCancel?.linkInfo}
        onSuccess={handleCancelSuccess}
      />

      <PurchaseLater
        isOpen={showPurchaseLater}
        onClose={handleClosePurchaseLater}
        orderId={selectedLinkForBuyLater?.orderId}
        linkId={selectedLinkForBuyLater?.linkId}
        orderCode={selectedLinkForBuyLater?.orderCode}
        linkInfo={selectedLinkForBuyLater?.linkInfo}
        onSuccess={handlePurchaseLaterSuccess}
      />

      <PinOrder
        isOpen={showPin}
        onClose={closePin}
        orderId={pinCtx?.orderId}
        orderCode={pinCtx?.orderCode}
        pinned={pinCtx?.pinned}
        onSuccess={handlePinSuccess}
      />

      {selectedLinkId && (
        <DetailOrderLink linkId={selectedLinkId} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default OrderLinkList;
