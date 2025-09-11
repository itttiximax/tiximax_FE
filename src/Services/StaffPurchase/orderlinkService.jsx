// src/Services/SharedService/orderlinkService.jsx
import api from "../../config/api.js";

const orderlinkService = {
  // Get orders with links (paginated)
  getOrdersWithLinks: async (page = 0, size = 10) => {
    try {
      // Input validation
      if (typeof page !== "number" || page < 0) {
        throw new Error("Page must be a non-negative number");
      }

      if (typeof size !== "number" || size <= 0 || size > 100) {
        throw new Error(
          "Size must be a positive number and less than or equal to 100"
        );
      }

      console.log(`🔍 Making request to: /orders/with-links/${page}/${size}`);
      console.log(`📊 Request params:`, { page, size });

      const response = await api.get(`/orders/with-links/${page}/${size}`);

      console.log("📦 Raw API response:", response);
      console.log("📦 Response data:", response.data);
      console.log("📊 Response structure check:", {
        hasContent: !!response.data?.content,
        contentLength: response.data?.content?.length || 0,
        hasNumber: response.data?.number !== undefined,
        hasSize: response.data?.size !== undefined,
        hasTotalPages: response.data?.totalPages !== undefined,
        hasTotalElements: response.data?.totalElements !== undefined,
        hasFirst: response.data?.first !== undefined,
        hasLast: response.data?.last !== undefined,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching orders with links:");
      console.error("❌ Error object:", error);

      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
        console.error("❌ Response headers:", error.response.headers);
        console.error("❌ Response config:", error.response.config);
      } else if (error.request) {
        console.error("❌ Request was made but no response:", error.request);
      } else {
        console.error("❌ Error setting up request:", error.message);
      }

      throw error;
    }
  },

  // Get order with links by ID
  getOrderWithLinksById: async (orderId) => {
    try {
      // Input validation
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      if (typeof orderId !== "number" && typeof orderId !== "string") {
        throw new Error("Order ID must be a number or string");
      }

      console.log(`🔍 Making request to: /orders/with-links/${orderId}`);
      console.log(`📊 Request params:`, { orderId });

      const response = await api.get(`/orders/with-links/${orderId}`);

      console.log("📦 Raw API response:", response);
      console.log("📦 Response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching order with links by ID:");
      console.error("❌ Error object:", error);

      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
        console.error("❌ Response headers:", error.response.headers);
        console.error("❌ Response config:", error.response.config);
      } else if (error.request) {
        console.error("❌ Request was made but no response:", error.request);
      } else {
        console.error("❌ Error setting up request:", error.message);
      }

      throw error;
    }
  },

  // Get order link by ID
  getOrderLinkById: async (linkId) => {
    try {
      // Input validation
      if (!linkId) {
        throw new Error("Link ID is required");
      }

      if (typeof linkId !== "number" && typeof linkId !== "string") {
        throw new Error("Link ID must be a number or string");
      }

      console.log(`🔍 Making request to: /orders/orderLink/${linkId}`);
      console.log(`📊 Request params:`, { linkId });

      const response = await api.get(`/orders/orderLink/${linkId}`);

      console.log("📦 Raw API response:", response);
      console.log("📦 Response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching order link by ID:");
      console.error("❌ Error object:", error);

      if (error.response) {
        console.error("❌ Response status:", error.response.status);
        console.error("❌ Response data:", error.response.data);
        console.error("❌ Response headers:", error.response.headers);
        console.error("❌ Response config:", error.response.config);
      } else if (error.request) {
        console.error("❌ Request was made but no response:", error.request);
      } else {
        console.error("❌ Error setting up request:", error.message);
      }

      throw error;
    }
  },

  // Test connection method
  testConnection: async () => {
    try {
      console.log("🔍 Testing API connection...");
      const response = await api.get("/orders/with-links/0/1");
      console.log("✅ Connection test successful:", response.status);
      return true;
    } catch (error) {
      console.error("❌ Connection test failed:", error);
      return false;
    }
  },

  // Get orders with links with detailed error handling
  getOrdersWithLinksDebug: async (page = 0, size = 10) => {
    console.log("🚀 Starting getOrdersWithLinksDebug...");
    console.log("📊 Input parameters:", {
      page,
      size,
      pageType: typeof page,
      sizeType: typeof size,
    });

    try {
      // Input validation with detailed logging
      if (typeof page !== "number" || page < 0) {
        const error = new Error(
          `Page must be a non-negative number. Received: ${page} (type: ${typeof page})`
        );
        console.error("❌ Page validation failed:", error.message);
        throw error;
      }

      if (typeof size !== "number" || size <= 0 || size > 100) {
        const error = new Error(
          `Size must be a positive number and less than or equal to 100. Received: ${size} (type: ${typeof size})`
        );
        console.error("❌ Size validation failed:", error.message);
        throw error;
      }

      const endpoint = `/orders/with-links/${page}/${size}`;
      console.log(`🔍 Making request to endpoint: ${endpoint}`);
      console.log(
        `🌐 Full URL will be: ${api.defaults.baseURL || "BASE_URL"}${endpoint}`
      );

      // Log request config
      console.log("⚙️ API config:", {
        baseURL: api.defaults.baseURL,
        timeout: api.defaults.timeout,
        headers: api.defaults.headers,
      });

      const startTime = performance.now();
      const response = await api.get(endpoint);
      const endTime = performance.now();

      console.log(
        `⏱️ Request completed in ${(endTime - startTime).toFixed(2)}ms`
      );
      console.log("✅ Request successful!");
      console.log("📦 Response status:", response.status);
      console.log("📦 Response headers:", response.headers);
      console.log("📦 Raw response data:", response.data);

      // Validate response structure
      const data = response.data;
      const validationResults = {
        hasData: !!data,
        hasContent: !!data?.content,
        contentIsArray: Array.isArray(data?.content),
        contentLength: data?.content?.length || 0,
        hasNumber: data?.number !== undefined,
        numberValue: data?.number,
        hasSize: data?.size !== undefined,
        sizeValue: data?.size,
        hasTotalPages: data?.totalPages !== undefined,
        totalPagesValue: data?.totalPages,
        hasTotalElements: data?.totalElements !== undefined,
        totalElementsValue: data?.totalElements,
        hasFirst: data?.first !== undefined,
        firstValue: data?.first,
        hasLast: data?.last !== undefined,
        lastValue: data?.last,
      };

      console.log("🔍 Response validation results:", validationResults);

      // Check if all required pagination fields are present
      const requiredFields = [
        "content",
        "number",
        "size",
        "totalPages",
        "totalElements",
        "first",
        "last",
      ];
      const missingFields = requiredFields.filter(
        (field) => data?.[field] === undefined
      );

      if (missingFields.length > 0) {
        console.warn("⚠️ Missing pagination fields:", missingFields);
      } else {
        console.log("✅ All pagination fields present");
      }

      // Log sample order data if available
      if (data?.content && data.content.length > 0) {
        console.log("📋 Sample order structure:", {
          firstOrder: data.content[0],
          orderKeys: Object.keys(data.content[0] || {}),
          hasOrderLinks: !!data.content[0]?.orderLinks,
          orderLinksCount: data.content[0]?.orderLinks?.length || 0,
        });
      }

      return data;
    } catch (error) {
      console.error("❌ getOrdersWithLinksDebug failed!");
      console.error("❌ Error type:", error.constructor.name);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);

      if (error.response) {
        console.error("❌ HTTP Error Response:");
        console.error("  - Status:", error.response.status);
        console.error("  - Status Text:", error.response.statusText);
        console.error("  - Headers:", error.response.headers);
        console.error("  - Data:", error.response.data);
        console.error("  - Config:", error.response.config);
      } else if (error.request) {
        console.error("❌ Network Error - Request made but no response:");
        console.error("  - Request:", error.request);
      } else {
        console.error("❌ Setup Error:", error.message);
      }

      throw error;
    }
  },
};

// Export both object and backward compatibility functions
export default orderlinkService;

// BACKWARD COMPATIBILITY
export const getOrdersWithLinks = orderlinkService.getOrdersWithLinks;
export const getOrderWithLinksById = orderlinkService.getOrderWithLinksById;
export const getOrderLinkById = orderlinkService.getOrderLinkById;

// Additional exports for debugging
export const testConnection = orderlinkService.testConnection;
export const getOrdersWithLinksDebug = orderlinkService.getOrdersWithLinksDebug;
